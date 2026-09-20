# 구조동역학 · 내진설계 · 내풍공학 전주기 통합 마스터 시뮬레이터
> **Chopra §1~§13 기초 진동론부터 KDS 41 규준 모달 내진설계, 초고층 내풍공학, FEMA 356 비선형 성능기반설계(PBD)까지 30단계 전주기 정본 시뮬레이션 플랫폼**

---

## 🚀 학생 및 연구자 원클릭 실행 (Live Links)

아래 버튼 또는 링크를 클릭하면 별도의 설치 없이 스마트폰, 태블릿, 노트북 브라우저에서 즉시 실행됩니다:

<div align="center">
  <br>
  <a href="https://titoliviomilazzo.github.io/dynamics-simulators/journey.html">
    <img src="https://img.shields.io/badge/1.%20Apple%20Style%20저니%20(스토리라인%20학습)-즉시%20실행-0071e3?style=for-the-badge&logo=apple&logoColor=white" height="42" alt="Apple Style Journey">
  </a>
  &nbsp;&nbsp;
  <a href="https://titoliviomilazzo.github.io/dynamics-simulators/index.html">
    <img src="https://img.shields.io/badge/2.%20클래식%20마스터%20허브%20(그리드%20인덱스)-즉시%20실행-0f172a?style=for-the-badge&logo=google-chrome&logoColor=white" height="42" alt="Classic Master Hub">
  </a>
  <br><br>
</div>

| 구분 | 링크 주소 | 주요 기능 및 용도 |
|---|---|---|
| **1. Apple 스타일 스크롤 저니** | [👉 바로 열기 (journey.html)](https://titoliviomilazzo.github.io/dynamics-simulators/journey.html) | • 1단계 공진부터 30단계 FEMA 손상역학까지 아래로 스크롤하며 순차 탐구<br>• Apple "White museum gallery" 디자인 및 시그니처 컬러 코딩 타이포그래피 |
| **2. 클래식 마스터 허브** | [👉 바로 열기 (index.html)](https://titoliviomilazzo.github.io/dynamics-simulators/index.html) | • 4대 전공 트랙별 필터링, 키워드 검색, 30개 시뮬레이터 일람<br>• 진한 2px 테두리와 솔리드 3D 입체 블록 인터페이스 |

---

## 📚 4대 전공 트랙 구성 (30개 정본 시뮬레이터)

### 🔹 Track 01. 구조동역학 & 진동론 (9개 모듈)
- [정본 01. SDOF 공진 & 동적증폭계수(DAF) 해석기](https://titoliviomilazzo.github.io/dynamics-simulators/01_sdof_resonance.html)
- [정본 13. 점성감쇠 vs 마찰감쇠 (Viscous vs Coulomb Damping)](https://titoliviomilazzo.github.io/dynamics-simulators/13_damping_viscous_vs_coulomb.html)
- [정본 09. 주파수 응답 전달함수(Transfer Function) & Bode 선도](https://titoliviomilazzo.github.io/dynamics-simulators/09_transfer_function_bode.html)
- [정본 10. 신호처리: 고속 푸리에 변환(FFT) & 파워스펙트럼밀도(PSD)](https://titoliviomilazzo.github.io/dynamics-simulators/10_fourier_fft_psd.html)
- [정본 08. Newmark-β 시간영역 직접적분 안정성 해석기](https://titoliviomilazzo.github.io/dynamics-simulators/08_newmark_beta_stability.html)
- [정본 04. 고유치 해석 & 모드 직교성 & 좌표계 비연성화](https://titoliviomilazzo.github.io/dynamics-simulators/04_eigen_orthogonality_decoupling.html)
- [정본 12. 모드 중첩 오케스트라: 1차+2차+3차 모드 합성](https://titoliviomilazzo.github.io/dynamics-simulators/12_modal_superposition_orchestra.html)
- [정본 34. 강체 vs 연성체 지반진동 증폭 & 채찍 효과(Whip Effect)](https://titoliviomilazzo.github.io/dynamics-simulators/34_rigid_vs_flexible_whip.html)
- [정본 35. 모든 모드 절대값 합(Σ|Ln|) = 정적 하중벡터 증명기](https://titoliviomilazzo.github.io/dynamics-simulators/35_abssum_equals_static_proof.html)

### 🔹 Track 02. 내풍공학 & 멀티해저드 (3개 모듈)
- [정본 11. 풍하중 vs 지진하중 하중 메커니즘 대조 시뮬레이터](https://titoliviomilazzo.github.io/dynamics-simulators/11_wind_vs_seismic_load.html)
- [정본 36. 지진 질량분배 vs 옥탑방 고차모드 가속도 증폭의 역설](https://titoliviomilazzo.github.io/dynamics-simulators/36_rigid_body_participation_penthouse.html)
- [정본 05. CQC 3차원 기하학적 절벽: 타이베이 101 비틀림-횡진동 연성](https://titoliviomilazzo.github.io/dynamics-simulators/05_cqc_geometry_cliff_taipei101.html)

### 🔹 Track 03. 규준 내진설계 & 모달해석 (13개 모듈)
- [정본 02. 모드참여계수(Γn) & 유효모드질량(Mn*) 질량 완전성](https://titoliviomilazzo.github.io/dynamics-simulators/02_modal_participation_effective_mass.html)
- [정본 03. 다층 골조 응답스펙트럼 해석 & 모달 조합법 (SRSS vs CQC)](https://titoliviomilazzo.github.io/dynamics-simulators/03_multistory_response_spectrum.html)
- [정본 06. 등가정적 vs 동적해석 85% 밑면전단력 스케일링](https://titoliviomilazzo.github.io/dynamics-simulators/06_static_vs_dynamic_85pct_scaling.html)
- [정본 07. 설계 포락선(Envelope)의 두 얼굴 & P-M 허상 방지](https://titoliviomilazzo.github.io/dynamics-simulators/07_envelope_two_tiers.html)
- [정본 38. MIDAS CQC 조합결과 진단도구: ρij 매트릭스 결함 검증](https://titoliviomilazzo.github.io/dynamics-simulators/38_midas_cqc_diagnostic_tool.html)
- [정본 39. Newmark 삼분도표(Tripartite) & ADRS 용량스펙트럼 변환기](https://titoliviomilazzo.github.io/dynamics-simulators/39_newmark_tripartite_adrs.html)
- [정본 40. KDS 41 내진해석법 판정 네비게이터: 등가정적 vs 모달스펙트럼](https://titoliviomilazzo.github.io/dynamics-simulators/40_kds_analysis_method_selector.html)
- [정본 42. 변위증폭계수(Cd) & 비탄성 층간변위비(1.5% 한계) 검증기](https://titoliviomilazzo.github.io/dynamics-simulators/42_cd_deflection_amplification_inelastic_drift.html)
- [정본 43. 주기상한(CuTa) 제한규준 & 1차모드 비틀림 결함 경보기](https://titoliviomilazzo.github.io/dynamics-simulators/43_period_upper_bound_torsion_warning.html)
- [정본 45. KDS 41 내진설계 전주기 파이프라인 네비게이터](https://titoliviomilazzo.github.io/dynamics-simulators/45_kds41_seismic_code_navigator_pipeline.html)

### 🔹 Track 04. 비선형 성능기반설계 (PBD) & FEMA 356 (5개 모듈)
- [정본 37. Newmark 등변위 규칙 & 반응수정계수(R=5 지진력 1/5 삭감)](https://titoliviomilazzo.github.io/dynamics-simulators/37_newmark_equal_displacement_r_factor.html)
- [정본 41. 반응수정계수 R의 3중 분해(R = R_R &middot; R_Ω &middot; R_Y) & 이중골조 시스템](https://titoliviomilazzo.github.io/dynamics-simulators/41_r_factor_decomposition_dual_system.html)
- [정본 44. 비선형 능력스펙트럼법(CSM) & 성능점(Performance Point) 수렴기](https://titoliviomilazzo.github.io/dynamics-simulators/44_capacity_spectrum_method_performance_point.html)
- [정본 24. RC 기둥 P-M 상관도 & 강도감소계수(φ) 연성-취성 전이곡면](https://titoliviomilazzo.github.io/dynamics-simulators/24_rc_column_pm_interaction_diagram.html)
- [정본 28. FEMA 힌지 백본(IO-LS-CP) & 단면 200배 거시-미시 손상 통합](https://titoliviomilazzo.github.io/dynamics-simulators/28_fema_backbone_io_ls_cp.html)
- [정본 29. 기둥 밑둥 소성힌지 단면 200배 줌인 4단계 미시 손상역학](https://titoliviomilazzo.github.io/dynamics-simulators/29_plastic_hinge_cross_section_damage.html)

---

## 💻 실행 기술 스택
- **프론트엔드**: HTML5, Canvas API, Tailwind CSS, FontAwesome 6
- **인터랙션 & 애니메이션**: GSAP 3.13.0, Awwwards Reference Physics System
- **수치해석**: Euler-Cromer 시간적분, Newmark-β 직접적분, CQC/SRSS 모달 조합, ADRS 반복 수렴
- **호스팅**: GitHub Pages (HTTPS 보안 연결)

---

## 📐 시각화 & 인터페이스 정본화 규준 (Canonical Design Standards)
모든 시뮬레이터와 차트는 다음 정본화 원칙을 엄격히 준수합니다:
1. **어두운 계열 채색 절대 배제 (Light & Clean Principle)**:
   - 그래프 영역 면적 채색, 플로팅 뱃지, 호버 툴팁, 플롯 배경 등에 어두운 색상(`rgba(15, 23, 42, ...)`, `#0f172a`, `#1e293b` 등)을 채움색으로 사용하지 않습니다.
   - 항상 라이트 톤 카드(`rgba(255, 255, 255, 0.96)`, `#f8fafc`, 1px `#cbd5e1` 보더)와 은은한 파스텔 틴트(`rgba(..., 0.06~0.08)`)만 사용합니다.
2. **라벨 & 뱃지 텍스트 자동 크기 조절 (Dynamic Auto-Adjustment)**:
   - 캔버스 내 모든 배지 및 툴팁은 고정 픽셀 폭을 사용하지 않고 `ctx.measureText`로 텍스트 길이를 실측하여 박스 크기를 동적으로 맞춥니다.
   - 컨테이너 폭이 협소할 경우 폰트 크기를 단계적으로 자동 축소하고 위치를 캔버스 안쪽으로 클램핑하여 라벨이 박스나 화면 밖으로 넘치지 않도록 방지합니다.
3. **물리적 경계조건 및 정적 평형 엄밀성 (Authentic Structural Physics)**:
   - 바닥 기초면은 절대 변위와 회전각이 0인 완전 고정단($u=0, \theta=0$)으로 구속합니다.
   - KDS 등가정적 하중 및 정적 횡력 시뮬레이션에서는 시간에 따른 사인파 진동을 배제하고 순수 캔틸레버 정적 휨 탄성곡선($\psi(z) = 1.5(z/H)^2 - 0.5(z/H)^3$)만을 렌더링합니다.
4. **3D 동적 진동 가시성 증폭 및 배율 제어 (3D Vibration Scale Gate)**:
   - 실제 수 cm 단위의 미세 층간변위가 3D 화면에서 묻히지 않도록 기본 스케일 팩터를 60~75배 이상으로 증폭 적용합니다.
   - 사용자가 직접 시각적 변위 배율을 제어할 수 있는 `[1x | 2x (표준) | 4x (확대)]` 인터랙티브 스위처를 3D 뷰어 좌하단 HUD에 의무 배치합니다.
   - 지반가속도 인가 시 바닥 기초면(Foundation Bedrock)도 실시간 좌우로 흔들리도록 동기화합니다.
5. **Awwwards Pack 인터랙티브 피직스 카드 (Zentry 3D Tilt & Damping)**:
   - 핵심 결과 비교 카드에는 마우스 호버 시 3D 원근감(`perspective: 800px`, `rotateX/Y`)과 부드러운 스프링 텐션으로 반응하는 Zentry 3D 틸트 효과를 적용합니다.

