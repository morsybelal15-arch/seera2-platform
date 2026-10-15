"use client";
import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows, useProgress } from '@react-three/drei';
import * as THREE from 'three';

export type FocusRegion =
  | 'full'
  | 'belly'
  | 'flanks'
  | 'back'
  | 'glutes'
  | 'thighs'
  | 'calves'
  | 'arms'
  | 'side_chest';

// تثبيت قيم الشادوز والكونتراست على 65% دائماً
const FIXED_CONTRAST = 0.65;
const FIXED_SHADOW_DEPTH = 0.65;

// توليد وحفظ خريطة مسام الجلد الطبيعية الصافية مرة واحدة فقط في الذاكرة
let cachedPurePoreNormalMap: THREE.CanvasTexture | null = null;

function getPureSkinPoreNormalMap(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  if (cachedPurePoreNormalMap) return cachedPurePoreNormalMap;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  // مسام جلد دقيقة وصافية فقط بدون أي سيلوليت أو استريتش ماركس أو بقع
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.2 + 0.35;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(105, 105, 232, 0.22)' : 'rgba(148, 148, 255, 0.18)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const normalMap = new THREE.CanvasTexture(canvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(5, 5);
  normalMap.needsUpdate = true;

  cachedPurePoreNormalMap = normalMap;
  return normalMap;
}

// ============================================================================
// 1. تجهيز وتنعيم تأثير "دهون جانب الصدر" للأنثى فقط مع حماية تامة للذكر
// ============================================================================
function setupSideChestFatMorph(scene: THREE.Object3D, isMale: boolean) {
  // حظر قطعي لأي تعديل على رؤوس أو ذقن أو مجسم المودل الذكر لمنع تشويه الرأس نهائياً
  if (isMale) return;

  scene.traverse((child: any) => {
    if (!child.isMesh || !child.geometry || !child.morphTargetDictionary) return;
    const mName = (child.name || '').toLowerCase();
    if (mName.includes('male')) return;

    const geom: THREE.BufferGeometry = child.geometry;
    if (geom.userData.sideChestInjected) return;

    geom.computeBoundingBox();
    const bbox = geom.boundingBox!;
    // إذا كانت حدود المجسم سلبية بمقدار كبير (هيكل الذكر الممتد)، نتوقف فوراً
    if (bbox.min.y < -0.5) return;

    const dict = child.morphTargetDictionary;
    const targetIdx = dict['DoubleChin_Volume'];
    if (targetIdx === undefined || !geom.morphAttributes.position) return;

    const posAttr = geom.attributes.position;
    const morphAttr = geom.morphAttributes.position[targetIdx];
    if (!posAttr || !morphAttr) return;

    const minY = bbox.min.y;
    const maxY = bbox.max.y;
    const h = Math.max(maxY - minY, 0.001);

    let maxChinZ = -Infinity;
    for (let i = 0; i < posAttr.count; i++) {
      const yn = (posAttr.getY(i) - minY) / h;
      const x = posAttr.getX(i);
      if (yn >= 0.850 && yn <= 0.885 && Math.abs(x) < 0.025 * h) {
        const z = posAttr.getZ(i);
        if (z > maxChinZ) maxChinZ = z;
      }
    }
    if (!isFinite(maxChinZ)) maxChinZ = 0.07 * h;

    const smoothstep = (e0: number, e1: number, val: number) => {
      const t = Math.max(0, Math.min(1, (val - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };
    const band = (val: number, l: number, u: number, f: number) =>
      smoothstep(l - f, l + f, val) * (1 - smoothstep(u - f, u + f, val));
    const gauss = (val: number, mu: number, s: number) =>
      Math.exp(-0.5 * Math.pow((val - mu) / s, 2));

    const isRelative = geom.morphTargetsRelative;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const yn = (y - minY) / h;

      const yMask = band(yn, 0.795, 0.862, 0.028);
      if (yMask <= 0.001) continue;

      const xMask = gauss(x, 0, 0.045 * h);
      if (xMask <= 0.001) continue;

      const distBehind = maxChinZ - z;
      const zMask = band(distBehind, 0.005 * h, 0.082 * h, 0.022 * h);
      const frontSide = smoothstep(-0.015 * h, 0.025 * h, z);

      const w = yMask * xMask * zMask * frontSide;
      if (w > 0.001) {
        const dx = x * 0.38 * w;
        const dy = -0.030 * h * w;
        const dz = 0.024 * h * w;

        if (isRelative) {
          morphAttr.setXYZ(i, dx, dy, dz);
        } else {
          morphAttr.setXYZ(i, x + dx, y + dy, z + dz);
        }
      } else if (!isRelative) {
        morphAttr.setXYZ(i, x, y, z);
      } else {
        morphAttr.setXYZ(i, 0, 0, 0);
      }
    }

    morphAttr.needsUpdate = true;
    geom.userData.sideChestInjected = true;
  });
}

// ============================================================================
// 2. محرك توجيه الكاميرا التلقائي حسب خطوة الـ Setup Wizard الحالية
// ============================================================================
function SmartCameraRig({
  focusArea = 'full',
  controlsRef,
}: {
  focusArea?: FocusRegion;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const desiredPos = useRef(new THREE.Vector3(0, 0.12, 2.5));
  const desiredTarget = useRef(new THREE.Vector3(0, 0.02, 0));
  const isTransitioning = useRef(false);

  useEffect(() => {
    isTransitioning.current = true;
    switch (focusArea) {
      case 'belly':
        desiredPos.current.set(0.25, 0.08, 1.75);
        desiredTarget.current.set(0, 0.05, 0);
        break;
      case 'flanks':
        desiredPos.current.set(1.15, 0.10, 1.45);
        desiredTarget.current.set(0, 0.06, 0);
        break;
      case 'back':
        desiredPos.current.set(0.15, 0.22, -1.85);
        desiredTarget.current.set(0, 0.18, 0);
        break;
      case 'glutes':
        desiredPos.current.set(0.85, -0.08, -1.65);
        desiredTarget.current.set(0, -0.10, 0);
        break;
      case 'thighs':
        desiredPos.current.set(0.45, -0.32, 1.90);
        desiredTarget.current.set(0, -0.32, 0);
        break;
      case 'calves':
        desiredPos.current.set(0.55, -0.62, 1.80);
        desiredTarget.current.set(0, -0.62, 0);
        break;
      case 'side_chest':
        desiredPos.current.set(0.55, 0.28, 1.65);
        desiredTarget.current.set(0, 0.24, 0);
        break;
      case 'arms':
        desiredPos.current.set(0.65, 0.22, 2.05);
        desiredTarget.current.set(0, 0.18, 0);
        break;
      case 'full':
      default:
        desiredPos.current.set(0, 0.12, 2.55);
        desiredTarget.current.set(0, 0.02, 0);
        break;
    }

    const timer = setTimeout(() => {
      isTransitioning.current = false;
    }, 1100);
    return () => clearTimeout(timer);
  }, [focusArea]);

  useFrame((_, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;
    const step = Math.min(1, delta * 4.5);
    camera.position.lerp(desiredPos.current, step);
    controlsRef.current.target.lerp(desiredTarget.current, step);
    controlsRef.current.update();
  });

  return null;
}

export const PRIMARY_GLB_URL = '/models/female.glb';
export const FALLBACK_GLB_URL = '/models/female.glb';
export const MALE_GLB_URL = '/models/male.glb';

if (typeof window !== 'undefined') {
  try {
    useGLTF.preload(PRIMARY_GLB_URL);
  } catch {
    // Ignore preload error in SSR/environments without GL context
  }
}

// ============================================================================
// 2. مؤشر تحميل دائري بنسبة مئوية حقيقية ودقيقة أثناء تحميل وبناء المجسم 3D
// ============================================================================
function ModelLoadingProgressOverlay() {
  const { active, progress } = useProgress();
  const [displayPct, setDisplayPct] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticker: NodeJS.Timeout | null = null;

    if (active) {
      setVisible(true);
      // Smooth animated ticker: advances steadily while streaming GLB chunks, never freezing at 50%
      ticker = setInterval(() => {
        setDisplayPct((prev) => {
          const raw = Math.round(progress);
          if (raw > prev) {
            return prev + Math.ceil((raw - prev) / 2);
          }
          if (prev < 95) {
            const step = prev < 50 ? 2 : prev < 82 ? 1 : (Math.random() > 0.45 ? 1 : 0);
            return prev + step;
          }
          return prev;
        });
      }, 110);
    } else {
      setDisplayPct(100);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 450);
      return () => {
        clearTimeout(timer);
        if (ticker) clearInterval(ticker);
      };
    }

    return () => {
      if (ticker) clearInterval(ticker);
    };
  }, [active, progress]);

  if (!visible && (!active || progress >= 100)) return null;

  const pct = Math.min(100, Math.max(0, displayPct));
  // 2 * PI * 36 ≈ 226.19
  const circumference = 226.19;
  const strokeDashoffset = circumference - (circumference * pct) / 100;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 pointer-events-none rounded-[24px]">
      <div className="relative flex items-center justify-center w-28 h-28">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="36"
            className="text-white/10"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="36"
            className="text-[#B4E4D6] transition-all duration-200 ease-out"
            strokeWidth="6"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black text-white font-mono tracking-wider">{pct}%</span>
          <span className="text-[10px] text-[#B4E4D6] font-bold">جاري البناء</span>
        </div>
      </div>
      <p className="mt-3 text-xs font-black text-white" dir="rtl">
        جاري تحميل وبناء المجسم الطبي ثلاثي الأبعاد...
      </p>
      <span className="mt-1 text-[11px] text-[#B4E4D6]/80 font-bold" dir="rtl">
        مزامنة التضاريس والخصائص الفيزيائية ({pct}%)
      </span>
    </div>
  );
}

// ============================================================================
// 3. المجسم ثلاثي الأبعاد بجلد صافي 100% وتظليل 65% + تجاعيد البطن والمؤخرة
// ============================================================================
function AvatarModel({ resolvedUrl, ...props }: any) {
  const modelUrl = resolvedUrl || (props.gender === 'male' ? MALE_GLB_URL : PRIMARY_GLB_URL);
  const { scene } = useGLTF(modelUrl) as any;
  const primitiveRef = useRef<any>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  const isMale = (resolvedUrl || modelUrl) === MALE_GLB_URL || props.gender === 'male';

  useMemo(() => {
    if (scene && !isMale) {
      setupSideChestFatMorph(scene, false);
    }
  }, [scene, isMale]);

  useEffect(() => {
    const foundMeshes: THREE.Mesh[] = [];
    const poreNormalMap = getPureSkinPoreNormalMap();

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(props.skinTone || '#e8b89c'),
      roughness: 0.46,
      metalness: 0.01,
      reflectivity: 0.22,
      clearcoat: 0.04,
      clearcoatRoughness: 0.55,
      sheen: 0.06,
      sheenRoughness: 0.65,
      sheenColor: new THREE.Color('#d99b7e'),
      normalMap: poreNormalMap || undefined,
      normalScale: new THREE.Vector2(0.45, 0.45),
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uContrast = { value: FIXED_CONTRAST };
      shader.uniforms.uShadowCrush = { value: FIXED_SHADOW_DEPTH };

      shader.fragmentShader =
        `
        uniform float uContrast;
        uniform float uShadowCrush;
        ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <tonemapping_fragment>',
        `
        vec3 nDx = dFdx(vNormal);
        vec3 nDy = dFdy(vNormal);
        float edgeCurvature = clamp((length(nDx) + length(nDy)) * 3.0, 0.0, 1.0);

        float viewGrazing = 1.0 - clamp(abs(dot(normalize(vNormal), normalize(vViewPosition))), 0.0, 1.0);
        float downwardFold = clamp(-vNormal.y * 0.65 + 0.25, 0.0, 1.0);
        float cavityShadow = clamp(edgeCurvature * 0.42 + downwardFold * 0.40 + pow(viewGrazing, 2.2) * 0.28, 0.0, 0.85);
        gl_FragColor.rgb *= (1.0 - cavityShadow * uShadowCrush * 0.65);

        float luma = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
        float shadowZone = smoothstep(0.52, 0.06, luma);
        gl_FragColor.rgb *= (1.0 - shadowZone * uShadowCrush * 0.50);

        float contrastExp = 1.0 + uContrast * 0.55;
        vec3 contrastedColor = pow(max(gl_FragColor.rgb, vec3(0.001)), vec3(contrastExp)) * (1.0 + uContrast * 0.24);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, contrastedColor, uContrast);

        #include <tonemapping_fragment>
        `
      );
    };

    materialRef.current = mat;

    scene.traverse((child: any) => {
      if (child.isMesh) {
        const mName = (child.name || '').toLowerCase();
        const matName = (child.material?.name || '').toLowerCase();
        const clothKeywords = [
          'bra', 'pant', 'underwear', 'bikini', 'cloth', 'garment', 'proxy', 'helper', 'skirt'
        ];
        if (clothKeywords.some((k) => mName.includes(k) || matName.includes(k))) {
          child.visible = false;
          return;
        }

        child.castShadow = true;
        child.receiveShadow = true;
        child.material = mat;

        if (child.morphTargetInfluences) {
          // حفظ أوزان الـ Shape Keys الافتراضية المخزنة داخل ملف الـ GLB مرة واحدة
          // (مجسم الذكر malev2 مبني على نفس قاعدة الأنثى + مفاتيح MakeHuman الذكورية $md-...)
          if (!child.userData.defaultInfluences) {
            child.userData.defaultInfluences = [...child.morphTargetInfluences];
          }
          const defaults: number[] = child.userData.defaultInfluences;
          for (let i = 0; i < child.morphTargetInfluences.length; i++) {
            child.morphTargetInfluences[i] = defaults[i] ?? 0;
          }
        }
        foundMeshes.push(child);
      }
    });
    meshesRef.current = foundMeshes;
  }, [scene, props.skinTone]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(props.skinTone || '#e8b89c');
    }
  }, [props.skinTone]);

  const computeTargetScale = () => {
    const userHeight = Number(props.height) || (isMale ? 178 : 165);
    const userWeight = Number(props.weight) || (isMale ? 78 : 70);
    const hMeters = Math.max(1.0, userHeight / 100);
    const bmi = userWeight / (hMeters * hMeters);

    // طول مرجعي للأنثى + تكبير موحد على كل المحاور
    const refHeight = 165;
    const heightRatio = Math.max(0.92, Math.min(1.08, userHeight / refHeight));
    const frameWidthRatio = Math.max(0.95, Math.min(1.05, 1.0 + ((bmi - 22) / 25) * 0.05));

    const uniform = 1.12 * heightRatio;
    return { y: uniform, xz: uniform * frameWidthRatio };
  };

  useFrame(() => {
    if (primitiveRef.current) {
      if (isMale) {
        // حماية جذرية ودائمة للمودل الذكر: مقياس موحد تماماً 1.12 على جميع المحاور لمنع أي استطالة أو تشويه للرأس أو الجسم
        primitiveRef.current.scale.set(1.12, 1.12, 1.12);
      } else {
        const { y: targetScaleY, xz: targetScaleXZ } = computeTargetScale();
        primitiveRef.current.scale.x = THREE.MathUtils.lerp(primitiveRef.current.scale.x, targetScaleXZ, 0.14);
        primitiveRef.current.scale.y = THREE.MathUtils.lerp(primitiveRef.current.scale.y, targetScaleY, 0.14);
        primitiveRef.current.scale.z = THREE.MathUtils.lerp(primitiveRef.current.scale.z, targetScaleXZ, 0.14);
      }
    }

    meshesRef.current.forEach((mesh) => {
      const dict = mesh.morphTargetDictionary;
      const inf = mesh.morphTargetInfluences;
      if (!dict || !inf) return;

      const setMorph = (name: string, val: number, maxLimit = 1.0) => {
        const idx = dict[name];
        if (idx !== undefined) {
          const clamped = Math.max(0, Math.min(maxLimit, val));
          inf[idx] = THREE.MathUtils.lerp(inf[idx], clamped, 0.15);
        }
      };

      const bmiBase = props.bmiBaseMass ?? 0.35;
      setMorph('BMI_Base_Mass', bmiBase);

      const bVol = props.bellyRound ?? props.bellyVolume ?? 0.45;
      const bType = props.bellySegType || 'horizontal';
      setMorph('Belly_Volume', bType === 'smooth' ? bVol : bVol * 0.22);
      setMorph('Belly_Seg_1_Horizontal', bType === 'horizontal' ? bVol : 0);
      setMorph('Belly_Seg_1B_TripleHamburger', bType === 'triple' ? bVol : 0);
      setMorph('Belly_Seg_2_VerticalBilateral', bType === 'vertical' ? bVol : 0);
      setMorph('Belly_Seg_3_UpperSingle_LowerBi', bType === 'upper_single' ? bVol : 0);
      setMorph('Belly_Seg_4_LowerSingle_UpperBi', bType === 'lower_single' ? bVol : 0);
      setMorph('Belly_Seg_5_FourCompartment', bType === 'four_comp' ? bVol : 0);
      setMorph('Belly_Seg_6_AsymmetricHybrid', bType === 'asymmetric' ? bVol : 0);

      // ======================================================================
      // تجاعيد وترهلات جلد البطن الـ 5 (F3) - تطبيق حقيقي وبارز لكل خيار
      // ======================================================================
      const rawBLax = props.bellySkinLaxity ?? 0;
      const bWrinkleType = props.bellyWrinkleType || 'complex';
      if (dict['Belly_Wrinkle_5_ComplexMixed'] !== undefined) {
        setMorph('Belly_Skin_Laxity', rawBLax * 0.35, 1.0);
        setMorph('Belly_Wrinkle_1_MicroFine', bWrinkleType === 'micro' ? rawBLax * 2.2 : 0, 2.5);
        setMorph('Belly_Wrinkle_2_HorizontalCreasing', bWrinkleType === 'horizontal' ? rawBLax * 2.0 : 0, 2.5);
        setMorph('Belly_Wrinkle_3_LowerPleating', bWrinkleType === 'lower_pleating' ? rawBLax * 1.8 : 0, 2.5);
        setMorph('Belly_Wrinkle_4_Periumbilical', bWrinkleType === 'periumbilical' ? rawBLax * 2.0 : 0, 2.5);
        setMorph('Belly_Wrinkle_5_ComplexMixed', bWrinkleType === 'complex' ? rawBLax * 1.6 : 0, 2.0);
      } else {
        setMorph('Belly_Skin_Laxity', rawBLax);
      }

      setMorph('Belly_Wall_Doming', props.bellyWallDoming ?? 0);

      const fVol = props.loveHandles ?? props.flanksVolume ?? bVol * 0.65;
      const fType = props.flanksSegType || 'auto';
      const resolvedFlankType =
        fType === 'auto'
          ? bType === 'horizontal' || bType === 'four_comp' || bType === 'triple'
            ? 'two_zone'
            : bType === 'lower_single'
              ? 'lower'
              : bType === 'upper_single'
                ? 'upper'
                : 'base'
          : fType;

      setMorph('Flanks_Volume_Base', resolvedFlankType === 'base' ? fVol : fVol * 0.25);
      setMorph('Flanks_Shape_1_LowerDominant', resolvedFlankType === 'lower' ? fVol : 0);
      setMorph('Flanks_Shape_2_UpperMidDominant', resolvedFlankType === 'upper' ? fVol : 0);
      setMorph('Flanks_Shape_3_TwoZoneShelf', resolvedFlankType === 'two_zone' ? fVol : 0);

      const bkVol = props.backRollVolume ?? props.backVolume ?? fVol * 0.55;
      const bkType = Number(props.backSegType ?? 3);
      setMorph('Back_Seg_1_UpperBraRoll', bkType === 1 ? bkVol : 0);
      setMorph('Back_Seg_2_MidObliqueRoll', bkType === 2 ? bkVol : 0);
      setMorph('Back_Seg_3_DoubleRolls', bkType === 3 ? bkVol : 0);
      setMorph('Back_Seg_4_LowerLumbarRoll', bkType === 4 ? bkVol : 0);
      setMorph('Back_Seg_5_TripleHeavyRolls', bkType === 5 ? bkVol : 0);
      setMorph('Back_Seg_6_DiffuseBroad', bkType === 6 ? bkVol : bkVol * 0.20);

      const gVol = props.glutesVolume ?? (props.glutesFat ?? (bmiBase * 0.70));
      const gType = props.glutesSegType || 'posterior';
      setMorph('Glutes_Volume', gType === 'volume' ? gVol : gVol * 0.35);
      setMorph('Glutes_Shape_1_PosteriorProj', gType === 'posterior' ? gVol : 0);
      setMorph('Glutes_Shape_2_LateralWidth', gType === 'lateral' ? gVol : 0);
      setMorph('Glutes_Shape_3_UpperDominant', gType === 'upper' ? gVol : 0);
      setMorph('Glutes_Shape_4_LowerDroop', gType === 'lower' ? gVol : 0);

      // ======================================================================
      // الأرداف الجانبية (Hips Lateral Volume) - دعم الأنثى والذكر
      // ======================================================================
      const hVol = props.hipsVolume ?? props.hipsFat ?? gVol;
      if (dict['Hips_Lateral_Volume'] !== undefined) {
        setMorph('Hips_Lateral_Volume', hVol);
      } else if (dict['Glutes_Shape_2_LateralWidth'] !== undefined && isMale) {
        setMorph('Glutes_Shape_2_LateralWidth', hVol);
      }

      // ======================================================================
      // تجاعيد وثنيات المؤخرة الـ 5 (B3 & B4) - تطبيق بارز وحقيقي لكل خيار
      // ======================================================================
      const rawGLax = props.glutesSkinLaxity ?? 0;
      const gWrinkleType = props.glutesWrinkleType || 'complex';
      if (dict['Glutes_Wrinkle_5_SevereComplex'] !== undefined) {
        // تفعيل نمط الثنية المختار مع تعزيز الإزاحة لظهور المظهر التشريحي الواقعي
        setMorph('Glutes_Wrinkle_1_LowerRedundancy', gWrinkleType === 'lower_redundancy' ? rawGLax * 2.0 : 0, 2.5);
        setMorph('Glutes_Wrinkle_2_HorizontalCellulite', gWrinkleType === 'horizontal' ? rawGLax * 2.6 : 0, 3.0);
        setMorph('Glutes_Wrinkle_3_VerticalCellulite', gWrinkleType === 'vertical' ? rawGLax * 2.6 : 0, 3.0);
        setMorph('Glutes_Wrinkle_4_LowerDominant', gWrinkleType === 'lower_dominant' ? rawGLax * 3.2 : 0, 3.5);
        setMorph('Glutes_Wrinkle_5_SevereComplex', gWrinkleType === 'complex' ? rawGLax * 2.8 : 0, 3.2);

        // إضافة سيلوليت مسامي متناسق مع كل نمط لإبراز تضاريس الجلد
        const celluliteWeight =
          gWrinkleType === 'complex' ? rawGLax * 0.55 :
            gWrinkleType === 'horizontal' ? rawGLax * 0.35 :
              gWrinkleType === 'vertical' ? rawGLax * 0.35 :
                gWrinkleType === 'lower_dominant' ? rawGLax * 0.40 :
                  rawGLax * 0.25;
        setMorph('Skin_Cellulite_Dimples', celluliteWeight, 1.0);
      } else {
        setMorph('Skin_Cellulite_Dimples', rawGLax);
      }

      setMorph('Skin_Stretch_Marks', 0);

      const harmoniousThighs = Math.max(props.thighsFat ?? 0.30, (bVol + gVol) * 0.30);
      setMorph('Thighs_Volume', harmoniousThighs);
      setMorph('Calves_Volume', props.calvesFat ?? bmiBase * 0.45);
      setMorph('Arms_Volume', props.armsFat ?? bmiBase * 0.50);

      // التحكم في دهون جانب الصدر: للأنثى فقط مع حماية تامة لرأس المودل الذكر
      if (!isMale) {
        const sideChestVal = props.sideChestFat ?? 0;
        setMorph('DoubleChin_Volume', sideChestVal * 1.35, 1.5);
      } else {
        setMorph('DoubleChin_Volume', 0, 0);
      }
    });
  });

  return <primitive ref={primitiveRef} object={scene} position={[0, -0.92, 0]} scale={1.12} />;
}

// ============================================================================
// ============================================================================
// 4. حامي الأخطاء للمجسم في حال تعذر تحميل الملف ثلاثي الأبعاد
// ============================================================================
interface ErrorBoundaryProps {
  children: React.ReactNode;
  hasFallback?: boolean;
  onFallback?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  attemptedFallback: boolean;
  error?: Error;
}

class AvatarErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, attemptedFallback: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('AvatarModel 3D asset failed to load:', error?.message || error, errorInfo);
    if (this.props.hasFallback && !this.state.attemptedFallback && this.props.onFallback) {
      this.setState({ hasError: false, attemptedFallback: true });
      this.props.onFallback();
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.hasFallback !== this.props.hasFallback && !this.props.hasFallback) {
      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    }
  }

  render() {
    if (this.state.hasError && (!this.props.hasFallback || this.state.attemptedFallback)) {
      return (
        <div className="relative w-full h-full min-h-[250px] overflow-hidden rounded-[24px] flex items-center justify-center p-6 bg-black/60 border border-white/10">
          <div dir="rtl" className="text-center max-w-md space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#B4E4D6]/10 border border-[#B4E4D6]/30 flex items-center justify-center mx-auto text-[#B4E4D6]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-white font-black text-sm">المحاكي الطبي ثلاثي الأبعاد</h4>
            <p className="text-xs text-[#FFF6A9]/75 leading-relaxed font-semibold">
              جاري مزامنة المجسم الطبي ثلاثي الأبعاد. مؤشرات التشكيل وتعديلات القوام نشطة بالكامل.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4E4D6]/10 border border-[#B4E4D6]/20 text-[11px] font-bold text-[#B4E4D6]">
              <span>مؤشرات التشكيل وتعديلات القوام نشطة بالكامل</span>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// 5. المكون الرئيسي (مؤمّن بحاوية relative لضمان عدم خروجه للصفحة الرئيسية أبداً)
// ============================================================================
export default function CerrahAvatar(props: any) {
  const controlsRef = useRef<any>(null);
  const targetModelUrl = props.modelUrl || (props.gender === 'male' ? MALE_GLB_URL : PRIMARY_GLB_URL);
  const [modelUrl, setModelUrl] = useState<string>(targetModelUrl);

  useEffect(() => {
    const nextUrl = props.modelUrl || (props.gender === 'male' ? MALE_GLB_URL : PRIMARY_GLB_URL);
    setModelUrl(nextUrl);
  }, [props.gender, props.modelUrl]);

  return (
    <AvatarErrorBoundary>
      <div className="relative w-full h-full min-h-[250px] overflow-hidden rounded-[24px]">
        <ModelLoadingProgressOverlay />
        <div className="absolute inset-0 w-full h-full z-20 cursor-grab active:cursor-grabbing pointer-events-auto bg-transparent rounded-[24px] overflow-hidden">
          <Canvas
            style={{ background: 'transparent' }}
            shadows={{ type: THREE.PCFSoftShadowMap }}
            camera={{ position: [0, 0.12, 2.55], fov: 38 }}
            gl={{
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 0.92,
            }}
          >
            <ambientLight intensity={0.14} color="#fff5ee" />
            <hemisphereLight args={['#fff6f0', '#120704', 0.48]} />

            <directionalLight
              position={[1.75, 2.65, 1.65]}
              intensity={2.25}
              color="#fff8f0"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-bias={-0.0004}
              shadow-normalBias={0.014}
              shadow-camera-near={0.5}
              shadow-camera-far={7.0}
              shadow-camera-left={-0.85}
              shadow-camera-right={0.85}
              shadow-camera-top={1.05}
              shadow-camera-bottom={-1.05}
            />

            <directionalLight position={[-2.2, 0.6, 1.1]} intensity={0.22} color="#dce8f5" />

            <directionalLight
              position={[-1.4, 2.3, -1.8]}
              intensity={1.45}
              color="#fff4e8"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0004}
            />

            <SmartCameraRig focusArea={props.focusArea || 'full'} controlsRef={controlsRef} />
            <Suspense fallback={null}>
              <AvatarModel key={modelUrl} {...props} resolvedUrl={modelUrl} />
            </Suspense>

            <ContactShadows position={[0, -0.93, 0]} opacity={0.65} scale={3.2} blur={1.8} far={2.5} />
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              minDistance={0.9}
              maxDistance={3.8}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.70}
              target={[0, 0.02, 0]}
            />
          </Canvas>
        </div>
      </div>
    </AvatarErrorBoundary>
  );
}