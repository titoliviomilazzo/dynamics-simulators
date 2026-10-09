# 구조동역학 · 내진설계 · 내풍공학 전주기 통합 마스터 시뮬레이터
> **Chopra §1~§13 기초 진동론부터 KDS 41 규준 모달 내진설계, 초고층 내풍공학, FEMA 356 비선형 성능기반설계(PBD)·제진보강까지 전주기 정본 시뮬레이션 플랫폼**

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
| **1. Apple 스타일 스크롤 저니** | [👉 바로 열기 (journey.html)](https://titoliviomilazzo.github.io/dynamics-simulators/journey.html) | • SDOF 공진부터 FEMA 손상역학·제진보강까지 아래로 스크롤하며 순차 탐구<br>• Apple "White museum gallery" 디자인 및 시그니처 컬러 코딩 타이포그래피 |
| **2. 클래식 마스터 허브** | [👉 바로 열기 (index.html)](https://titoliviomilazzo.github.io/dynamics-simulators/index.html) | • 전공 트랙별 필터링, 키워드 검색, 전체 시뮬레이터 일람 (개수는 레지스트리에서 자동 계산)<br>• 진한 2px 테두리와 솔리드 3D 입체 블록 인터페이스 |

---

<!-- registry:tracks:start -->
## 📚 8개 전공 트랙 구성 (시뮬레이터 33개 · 정본 31 + 실습 2)

> 이 목록은 `assets/simulators.js`에서 생성됩니다. 시뮬레이터를 추가하면 `node tools/check-registry.mjs --write`로 갱신하세요.

### 🔹 Track 01. SDOF 진동 · 감쇠 · 과도응답 (3개 모듈)
1자유도 공진과 DAF, 점성 vs 마찰감쇠, 대수감쇠율, Step·충격 과도응답과 Duhamel 적분.

- [정본 01. SDOF 공진 & 동적증폭계수(DAF)](https://titoliviomilazzo.github.io/dynamics-simulators/01_sdof_resonance.html)
- [정본 13. 점성감쇠 vs 마찰감쇠 (Viscous vs Coulomb Damping)](https://titoliviomilazzo.github.io/dynamics-simulators/13_damping_viscous_vs_coulomb.html)
- [정본 14. 과도응답: 대수감쇠율 · Step/Impulse · Duhamel 적분](https://titoliviomilazzo.github.io/dynamics-simulators/14_transient_duhamel_step_impulse.html)

### 🔹 Track 02. 주파수영역 · 신호처리 · 수치적분 (3개 모듈)
전달함수와 Bode 선도, FFT/PSD 신호처리, Newmark-β 시간적분의 안정성과 수치감쇠.

- [정본 09. 주파수 응답 전달함수(Transfer Function) & Bode 선도](https://titoliviomilazzo.github.io/dynamics-simulators/09_transfer_function_bode.html)
- [정본 10. 신호처리: 고속 푸리에 변환(FFT) & 파워스펙트럼밀도(PSD)](https://titoliviomilazzo.github.io/dynamics-simulators/10_fourier_fft_psd.html)
- [정본 08. Newmark-β 수치적분법과 시간영역 적분 알고리즘 안정성](https://titoliviomilazzo.github.io/dynamics-simulators/08_newmark_beta_stability.html)

### 🔹 Track 03. MDOF 고유분해 · 모드해석 (6개 모듈)
고유분해와 직교성 비연성화, 모드 중첩, 모드참여계수·유효질량 90%, 옥탑 고차모드 역설.

- [정본 04. 고유분해와 Rayleigh 좌표 비연성화: 모드해석의 3대 본질](https://titoliviomilazzo.github.io/dynamics-simulators/04_eigen_orthogonality_decoupling.html)
- [정본 12. 모드 중첩 오케스트라 (Modal Superposition)](https://titoliviomilazzo.github.io/dynamics-simulators/12_modal_superposition_orchestra.html)
- [실습 W02-A. 2자유도 모드별 움직임과 동적 합성 캔버스](https://titoliviomilazzo.github.io/dynamics-simulators/mode-demo.html)
- [실습 W02-B. 구조동역학 14대 정적 시각화 도표 뷰어](https://titoliviomilazzo.github.io/dynamics-simulators/visuals.html)
- [정본 02. 모드참여계수(Γn) & 유효질량(Mn*) 90% 완전성 규준](https://titoliviomilazzo.github.io/dynamics-simulators/02_modal_participation_effective_mass.html)
- [정본 36. 강체운동 지분 분해(그림 9) & 옥탑 가속도 역설](https://titoliviomilazzo.github.io/dynamics-simulators/36_rigid_body_participation_penthouse.html)

### 🔹 Track 04. 풍하중 vs 지진하중 메커니즘 (2개 모듈)
외표면 압력(바람)과 내부 관성력(지진)의 층전단 분포 대조, 유연 골조의 채찍 효과 증폭.

- [정본 11. 풍하중(외표면 압력) vs 지진하중(내부 관성력) 역학 메커니즘 대조](https://titoliviomilazzo.github.io/dynamics-simulators/11_wind_vs_seismic_load.html)
- [반전 0. 강체(F=ma) vs 채찍(유연 골조) 42% 지진력 폭증의 배신](https://titoliviomilazzo.github.io/dynamics-simulators/34_rigid_vs_flexible_whip.html)

### 🔹 Track 05. 응답스펙트럼 · 모드조합 (7개 모듈)
진자 배열 스펙트럼 생성, 삼분도표·ADRS, SRSS/CQC와 근접모드 절벽, ABSSUM 항등식, 포락선 부호소실.

- [정본 05. 초고층 비틀림-횡변위 연성 CQC 기하학적 절벽: 타이베이 101](https://titoliviomilazzo.github.io/dynamics-simulators/05_cqc_geometry_cliff_taipei101.html)
- [정본 46. 진자 배열 → 응답스펙트럼 생성기](https://titoliviomilazzo.github.io/dynamics-simulators/46_spectrum_pendulum_array.html)
- [정본 39. Newmark 삼분 응답 스펙트럼 (Tripartite) & ADRS 4-in-1](https://titoliviomilazzo.github.io/dynamics-simulators/39_newmark_tripartite_adrs.html)
- [정본 03. 다층 응답스펙트럼 해석 & 모드중첩(SRSS / CQC)](https://titoliviomilazzo.github.io/dynamics-simulators/03_multistory_response_spectrum.html)
- [반전 4. ABSSUM = 등가정적(ELF) 완전 항등식 증명기](https://titoliviomilazzo.github.io/dynamics-simulators/35_abssum_equals_static_proof.html)
- [정본 38. MIDAS Gen 실무용 30초 CQC 진단 & 85% Scale Factor 계산기](https://titoliviomilazzo.github.io/dynamics-simulators/38_midas_cqc_diagnostic_tool.html)
- [정본 07. 2단계 포락선(Envelope)과 P-M 상관도 부호소실(Sign Loss) 함정](https://titoliviomilazzo.github.io/dynamics-simulators/07_envelope_two_tiers.html)

### 🔹 Track 06. KDS 41 규준 내진설계 (6개 모듈)
규준 파이프라인 네비게이터, 해석법 선정, 85% 최소밑면전단력, CuTa 주기상한, R 삼중분해, Cd 변위증폭.

- [정본 45. KDS 41 내진설계 규준 인터랙티브 네비게이터 & 7단계 의사결정 파이프라인](https://titoliviomilazzo.github.io/dynamics-simulators/45_kds41_seismic_code_navigator_pipeline.html)
- [정본 40. KDS 구조해석법 선정기 & 지반(S1~S6)·비정형성 매트릭스](https://titoliviomilazzo.github.io/dynamics-simulators/40_kds_analysis_method_selector.html)
- [정본 41. 반응수정계수(R) 삼중분해 & 이중골조 25% 백업 랩](https://titoliviomilazzo.github.io/dynamics-simulators/41_r_factor_decomposition_dual_system.html)
- [정본 42. 변위증폭계수(Cd)의 실체 & 비탄성 층간변위·충돌(Pounding) 랩](https://titoliviomilazzo.github.io/dynamics-simulators/42_cd_deflection_amplification_inelastic_drift.html)
- [정본 43. 고유주기의 역설: 약산주기 vs 전산주기 상한(CuTa) & MIDAS 비틀림 경고](https://titoliviomilazzo.github.io/dynamics-simulators/43_period_upper_bound_torsion_warning.html)
- [정본 06. 등가정적(1,188 kN) vs 동적(737 kN) & KDS 85% 최소밑면전단력](https://titoliviomilazzo.github.io/dynamics-simulators/06_static_vs_dynamic_85pct_scaling.html)

### 🔹 Track 07. 비선형 성능기반설계 · 손상역학 (5개 모듈)
등변위 규칙과 R계수, 능력스펙트럼법 성능점, RC 기둥 P-M 상관도, FEMA 356 백본, 소성힌지 미시손상.

- [정본 37. Newmark 등변위 규칙 & 반응수정계수(R=5 지진력 1/5 삭감)의 실체](https://titoliviomilazzo.github.io/dynamics-simulators/37_newmark_equal_displacement_r_factor.html)
- [정본 44. 비선형 능력스펙트럼법(CSM) & 성능점(Performance Point) 반복 수렴기](https://titoliviomilazzo.github.io/dynamics-simulators/44_capacity_spectrum_method_performance_point.html)
- [정본 24. RC 기둥 P-M 상관도 & 강도감소계수(φ) 연성-취성 전이곡면](https://titoliviomilazzo.github.io/dynamics-simulators/24_rc_column_pm_interaction_diagram.html)
- [정본 28. FEMA 힌지 백본(IO-LS-CP) & 단면 200배 거시-미시 손상 통합](https://titoliviomilazzo.github.io/dynamics-simulators/28_fema_backbone_io_ls_cp.html)
- [정본 29. 기둥 밑둥 소성힌지 단면 200배 줌인 4단계 미시 손상역학](https://titoliviomilazzo.github.io/dynamics-simulators/29_plastic_hinge_cross_section_damage.html)

### 🔹 Track 08. 제진 · 내진보강 (1개 모듈)
선형/비선형 점성댐퍼 부가감쇠비, 층별 배치 효율, TMD 최적 튜닝, 보강 전후 응답 비교.

- [정본 47. 점성댐퍼 & TMD 제진보강 효과: 부가감쇠비 · 응답저감 · F–v 이력루프](https://titoliviomilazzo.github.io/dynamics-simulators/47_viscous_damper_tmd_retrofit.html)
<!-- registry:tracks:end -->

---

## 💻 실행 기술 스택
- **프론트엔드**: HTML5, Canvas API, Tailwind CSS, FontAwesome 6
- **인터랙션 & 애니메이션**: GSAP 3.13.0, Awwwards Reference Physics System
- **수치해석**: Euler-Cromer 시간적분, Newmark-β 직접적분, CQC/SRSS 모달 조합, ADRS 반복 수렴
- **호스팅**: GitHub Pages (HTTPS 보안 연결)

---

## 📐 시뮬레이터 시각화 및 인터페이스 10대 정본 게이트 (Canonical Non-Negotiable Gates)
모든 시뮬레이터와 3D BIM 애니메이션, 2D 캔버스 차트는 다음 10대 정본 게이트를 100% 엄격히 준수합니다 (원문: `agents/dynamics-simulators-policy.md`):

1. **3D 부재 시인성 절대 규준 (Black Outline & Rich Color Gate)**:
   - **흰색/밝은 콘크리트 물체 사용 시 반드시 굵은 검정색 테두리(`THREE.EdgesGeometry` + `color: 0x0f172a`, `linewidth: 2`)를 의무 장착합니다**.
   - 테두리 없는 흰색 물체는 배경과 뭉개지므로 사용을 전면 금지합니다.
   - 주요 기계/구조 부재는 확실한 유색(로열 블루 `#2563eb`, 다크 인더스트리얼 스틸 `#334155`, 티타늄 슬레이트 `#1e293b`, 앰버 오일창 `#f59e0b`, 레드 범퍼 `#dc2626`)으로 모델링합니다.

2. **스튜디오 조명 과노출 억제 (Anti-Blowout Lighting Gate)**:
   - Ambient Light와 Directional Light의 총합 강도가 2.5를 초과하지 않도록 밸런싱하여 반사광에 의한 화이트 블로우아웃(Blowout)을 원천 차단합니다.

3. **단일 화면 뷰포트 피팅 & 그래프 짤림 방지 (Single-Screen Viewport Fit Gate)**:
   - **조작 패널, 3D 애니메이션 뷰포트, 하단 시간/주파수 플롯이 한 화면(표준 1080p 및 노트북 높이 ~850-950px) 안에 스크롤 없이 온전히 다 들어와야 합니다**.
   - 3D 뷰포트 높이 `200~210px`, 플롯 캔버스 높이 `250~260px`, 패널 간격 `10~12px`로 컴팩트하게 구성하여 하단 시간축 및 라벨이 절대 짤리지 않게 보장합니다.

4. **기구학적 물리 한계 및 비침투 구속 (Kinematic Non-Penetration Gate)**:
   - 수레(Cart)는 압축/인장 시 댐퍼 실린더나 반력벽을 뚫고 지나가지 않도록 $\tanh$ 기반 소프트 클램핑 또는 기구학적 스트로크 한계를 필수로 적용합니다.

5. **실제 물리 기반의 정통 기구학 거동 (Authentic Physics Motion)**:
   - 단순 선형/등속 이동을 배제하고, 실제 스프링 탄성 복원력($-ku$), 점성 댐퍼 감쇠력($-cv$), 쿨롱 마찰력, 질량 가속도가 엄밀히 연동된 정통 기구학 거동을 구현합니다.

6. **라벨-그래프 비간섭 여백 확보 (Label-Plot Non-Overlap Gate)**:
   - 배지 및 텍스트 라벨이 곡선 및 데이터 영역을 가리지 않도록 충분한 내부 여백(`padLeft: 65`, `padRight: 30`, `padTop: 30`, `padBottom: 45`)과 `ctx.measureText` 기반 동적 클램핑을 적용합니다.

7. **2D 곡선 초고해상도 실크 스무스 곡선화 (Silk-Smooth Spline)**:
   - 1200포인트 고밀도 샘플링 또는 Catmull-Rom 3차 베지어 스플라인을 적용하여 지그재그 없는 유선형 곡선을 렌더링합니다. Canvas DPR 2.0 이상 강제.

8. **클린 라이트 모드 (Clean Light Mode) & 미색 배경 (#faf8f5)**:
   - 다크 테크 스타일(어두운 배경 `#0b1120`) 전면 금지. 메인 배경은 미색(`#faf8f5`), 카드는 화이트(`#ffffff`), 테두리는 `#e2e8f0`.

9. **정확한 역학 기호 표기 (축력 직선 화살표 & 모멘트 Rz 2D 평면 원호)**:
   - 축력 $P$는 수직 직선 화살표($\downarrow$/$\uparrow$), 휨모멘트 $M$ ($R_z$)은 2D 평면 내 원호 화살표($\curvearrowright$)로 표기하고 크기에 비례하여 실시간 연동.

10. **60fps 하드웨어 가속 및 프레임 루프 최적화**:
    - `requestAnimationFrame` 내에서 매 프레임 Three.js 지오메트리/머티리얼 동적 생성/파괴 금지. 변위 갱신만 수행하여 60fps 보장.

11. **기둥 하단부 고정단 구속 및 연속체 휨 변형 규준 (Fixed-Footing & Smooth Continuum Deflection Gate)**:
    - $y=0$ 기초 접합부는 완전 고정단($\theta=0, \kappa=0$)으로 기둥 전체의 강체 틸팅 회전을 엄격히 금지합니다.
    - 다분절 꺾임을 전면 배제하고, 오일러-베르누이 캔틸레버 처짐 곡선 기반 고밀도 단일 버퍼 지오메트리 연속체(세로 36분할 이상)로 유려하게 변형합니다. 주철근은 단면 내부 상대좌표를 엄격히 유지하며 일체 변형/좌굴합니다.

12. **사실적 3D 비선형 손상 메커니즘 규준 (Authentic 3D Structural Damage Mechanics Gate)**:
    - 압축지배 시 콘크리트 압축대(Whitney 등가블록)를 선명한 호박황색(`0xfacc15`, 투명도 `0.75`) 체적으로 표현하고, 압축연단 외측 팽창과 기초 위 파쇄 잔해(Rubble)를 물리적으로 배치합니다.
    - 인장지배 시 수평 균열선과 인장철근 네온 시안(`0x00f0ff`) 항복 발광을 실시간 연동합니다. 주철근은 38mm 튜브와 고채도 에미시브를 적용합니다.

13. **3D 휨모멘트 벡터의 높이축 직교 수평 중립축 회전 규준 (Orthogonal Neutral-Axis Bending Moment Gate)**:
    - 휨모멘트($M$)는 건물 높이축($Y$) 기준 비틀림($T$) 평면 배치를 전면 금지하며, 반드시 높이축에 직교하는 **수평 중립축(`tiltAxis`)을 회전축으로 수직 휨 평면 내에서 회전하는 원호**로 모델링합니다.
    - 인장측에서 상부 캡을 넘어 압축측으로 회전하여 압축연단으로 하향 꽂히는 원뿔 화살촉을 정렬합니다.

14. **다층 골조 절점 구속 및 다이어프램 일체 거동 규준 (Rigid Diaphragm Node-Locking Gate)**:
    - 다층 모델에서 기둥과 전단벽이 슬래브와 분리되는 오류를 금지하며, 상·하 슬래브 국소 좌표계(`localToWorld`)에 100% 절점 구속하여 슬래브 다이어프램의 병진 및 CR 기준 면내 비틀림 회전과 일체로 전단·경사 거동합니다.

15. **비틀림 모드 시각화 스케일 및 3D 뷰포트 여백 규준 (Torsion Amplitude & HUD Clearance Gate)**:
    - 1차 모드 비틀림 지배 등 주요 위험 모드의 회전각 진폭 스케일을 충분히 확보(`thetaY = rzFrac * 0.40 * eta * tau`)하여 슬래브 비틀림 및 모퉁이 기둥 과대 변위가 극적으로 식별되도록 합니다.
    - 3D 뷰포트 내 타겟 높이 상향 및 카메라 후퇴 배치를 통해 최상단 하중 화살표와 옥상 지표가 상단 HUD 배지에 겹치거나 캔버스 밖으로 잘리지 않는 숨통 여백을 보장합니다.


