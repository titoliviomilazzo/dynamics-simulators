/**
 * Simulator registry — the single source of truth for the hub (index.html)
 * and the story journey (journey.html).
 *
 * To add a simulator: append one entry to SIMULATORS with its act and track.
 * Hero counts, track counts, act counts and step numbers are computed from
 * this list, so nothing else needs to be renumbered.
 * `node tools/check-registry.mjs` verifies that every NN_*.html file is listed.
 */
(function () {
  "use strict";

  // Tracks group simulators by what they teach (independent of lecture order).
  const SIM_TRACKS = [
    {
      id: "sdof",
      short: "SDOF 진동",
      title: "SDOF 진동 · 감쇠 · 과도응답",
      en: "SDOF Vibration",
      icon: "fa-wave-square",
      desc: "1자유도 공진과 DAF, 점성 vs 마찰감쇠, 대수감쇠율, Step·충격 과도응답과 Duhamel 적분."
    },
    {
      id: "freq",
      short: "주파수·수치해석",
      title: "주파수영역 · 신호처리 · 수치적분",
      en: "Frequency Domain & Numerics",
      icon: "fa-chart-line",
      desc: "전달함수와 Bode 선도, FFT/PSD 신호처리, Newmark-β 시간적분의 안정성과 수치감쇠."
    },
    {
      id: "modal",
      short: "MDOF 모드해석",
      title: "MDOF 고유분해 · 모드해석",
      en: "MDOF Modal Analysis",
      icon: "fa-layer-group",
      desc: "고유분해와 직교성 비연성화, 모드 중첩, 모드참여계수·유효질량 90%, 옥탑 고차모드 역설."
    },
    {
      id: "wind",
      short: "풍하중 vs 지진",
      title: "풍하중 vs 지진하중 메커니즘",
      en: "Wind vs Seismic Loading",
      icon: "fa-wind",
      desc: "외표면 압력(바람)과 내부 관성력(지진)의 층전단 분포 대조, 유연 골조의 채찍 효과 증폭."
    },
    {
      id: "spectrum",
      short: "응답스펙트럼",
      title: "응답스펙트럼 · 모드조합",
      en: "Response Spectrum & Modal Combination",
      icon: "fa-chart-area",
      desc: "진자 배열 스펙트럼 생성, 삼분도표·ADRS, SRSS/CQC와 근접모드 절벽, ABSSUM 항등식, 포락선 부호소실."
    },
    {
      id: "code",
      short: "KDS 41 규준",
      title: "KDS 41 규준 내진설계",
      en: "Seismic Design Code (KDS 41)",
      icon: "fa-scale-balanced",
      desc: "규준 파이프라인 네비게이터, 해석법 선정, 85% 최소밑면전단력, CuTa 주기상한, R 삼중분해, Cd 변위증폭."
    },
    {
      id: "pbd",
      short: "비선형·PBD",
      title: "비선형 성능기반설계 · 손상역학",
      en: "Nonlinear PBD & Damage",
      icon: "fa-building-shield",
      desc: "등변위 규칙과 R계수, 능력스펙트럼법 성능점, RC 기둥 P-M 상관도, FEMA 356 백본, 소성힌지 미시손상."
    },
    {
      id: "control",
      short: "제진·보강",
      title: "제진 · 내진보강",
      en: "Supplemental Damping & Retrofit",
      icon: "fa-shield-halved",
      desc: "선형/비선형 점성댐퍼 부가감쇠비, 층별 배치 효율, TMD 최적 튜닝, 보강 전후 응답 비교."
    }
  ];

  // Lecture storyline (Acts). Order here is the roadmap order.
  const SIM_ACTS = [
    { act: 1, title: "Act 1. 단자유도 진동학과 주파수 영역 해석 (SDOF Dynamics & Frequency Domain)" },
    { act: 2, title: "Act 2. 외력의 양대 축: 내풍설계 vs 내진설계 멀티해저드 (Wind vs Seismic Mechanics)" },
    { act: 3, title: "Act 3. 복합 거동의 해체: 모드해석과 고유분해 (Decoupling MDOF Systems)" },
    { act: 4, title: "Act 4. 지진 질량의 분배와 옥탑방의 고차모드 역설 (Mass Participation & Penthouse)" },
    { act: 5, title: "Act 5. 응답스펙트럼과 KDS 규준 내진설계 (Response Spectrum & Design Codes)" },
    { act: 6, title: "Act 6. 극한의 비선형성과 성능기반 내진설계 (Nonlinear PBD & Life Safety)" }
  ];

  // Roadmap order: entries are listed act by act; step numbers are derived.
  const SIMULATORS = 
[
    {
      id: "01",
      act: 1,
      track: "sdof",
      num: "정본 01",
      title: "SDOF 공진 & 동적증폭계수(DAF)",
      standard: "Chopra §3 기초 진동론",
      badgeClass: "badge-pass",
      status: "Euler-Cromer 수치해석",
      leadQuestion: "탄성을 가진 1자유도는 외력 주파수와 공진할 때 어떻게 반응할까요?",
      desc: "외력 진동수와 고유진동수가 일치할 때(β=1.0) 발생하는 무한 공진, 90도 위상 지연 및 감쇠비(ζ)에 의한 동적증폭계수(DAF) 제어 메커니즘 수치해석.",
      file: "01_sdof_resonance.html",
      tags: ["SDOF", "공진", "DAF", "감쇠비", "동역학기초"]
    },
    {
      id: "13",
      act: 1,
      track: "sdof",
      num: "정본 13",
      title: "점성감쇠 vs 마찰감쇠 (Viscous vs Coulomb Damping)",
      standard: "Chopra §2, §3",
      badgeClass: "badge-pass",
      status: "자유진동 비교",
      leadQuestion: "유체저항에 의한 감쇠와 마찰에 의한 감쇠는 응답 포락선에서 어떤 차이를 보이는가?",
      desc: "지수함수적으로 무한히 줄어드는 점성감쇠와 선형적으로 감소하다가 멈추는(Stick) 쿨롱 마찰감쇠의 거동을 시각적으로 비교합니다.",
      file: "13_damping_viscous_vs_coulomb.html",
      tags: ["점성감쇠", "마찰감쇠", "포락선", "지수함수", "Stick"]
    },
    {
      id: "14",
      act: 1,
      track: "sdof",
      num: "정본 14",
      title: "과도응답: 대수감쇠율 · Step/Impulse · Duhamel 적분",
      standard: "Chopra §2, §4",
      badgeClass: "badge-pass",
      status: "Duhamel 합성곱",
      leadQuestion: "같은 하중도 갑자기 올리면 왜 2배까지 흔들리고, 짧은 펄스는 왜 충격량만 중요할까?",
      desc: "자유진동 피크의 ln 기울기로 감쇠비를 역산(대수감쇠율)하고, Step·램프·직사각·반사인·삼각 펄스와 이상 충격의 과도응답을 Duhamel 합성곱 넓이로 분해·검증합니다. 충격스펙트럼 Rd–td/Tn 포함.",
      file: "14_transient_duhamel_step_impulse.html",
      tags: ["자유진동", "대수감쇠율", "Step", "충격", "Duhamel", "충격스펙트럼"]
    },
  
    {
      id: "09",
      act: 1,
      track: "freq",
      num: "정본 09",
      title: "주파수 응답 전달함수(Transfer Function) & Bode 선도",
      standard: "주파수영역 해석학",
      badgeClass: "badge-pass",
      status: "Bode 플롯",
      leadQuestion: "구조물이 입력 하중에서 특정 주파수만 골라 증폭시키는 필터인 이유는?",
      desc: "입력 외력 대비 구조물 응답의 크기비(Gain)와 위상차(Phase)를 주파수 축에 투영하여 구조물이 주파수 필터로 작동함을 수학적으로 규명.",
      file: "09_transfer_function_bode.html",
      tags: ["전달함수", "Bode", "주파수응답", "Gain", "Phase"]
    },
    {
      id: "10",
      act: 1,
      track: "freq",
      num: "정본 10",
      title: "신호처리: 고속 푸리에 변환(FFT) & 파워스펙트럼밀도(PSD)",
      standard: "신호처리 및 계측",
      badgeClass: "badge-pass",
      status: "FFT 스펙트럼",
      leadQuestion: "불규칙한 바람과 지진 신호는 어떤 주파수 에너지로 채워져 있을까요?",
      desc: "시간이력 가속도 데이터를 실시간 FFT로 분해하여 주파수별 파워 스펙트럼 밀도(PSD)를 계산하고, 공진을 유발하는 지배 주파수 대역 탐색.",
      file: "10_fourier_fft_psd.html",
      tags: ["FFT", "푸리에", "PSD", "우세주파수", "신호처리"]
    },
  
    {
      id: "11",
      act: 2,
      track: "wind",
      num: "정본 11",
      title: "풍하중(외표면 압력) vs 지진하중(내부 관성력) 역학 메커니즘 대조",
      standard: "KDS 41 하중기준",
      badgeClass: "badge-wind",
      status: "하중역학 비교",
      leadQuestion: "바람이 미는 힘과 지진이 흔드는 힘은 왜 역학적으로 완전히 다를까요?",
      desc: "건물 표면적에 작용하는 공기역학적 외표면 압력(풍하중)과 건물 내부 질량에 가속도가 곱해져 밑둥에서 발생하는 관성력(지진하중)의 층별 전단력 분포 패턴 대조.",
      file: "11_wind_vs_seismic_load.html",
      tags: ["풍하중", "지진하중", "내풍설계", "관성력", "표면압력"]
    },
    {
      id: "34",
      act: 2,
      track: "wind",
      num: "반전 0",
      title: "강체(F=ma) vs 채찍(유연 골조) 42% 지진력 폭증의 배신",
      standard: "강의노트 §5.1 / 반전 0",
      badgeClass: "badge-kds",
      status: "오프닝 반전",
      leadQuestion: "건물을 강체로 가정하고 F=ma로 해석하면 왜 참사가 벌어질까요?",
      desc: "준정적 풍하중과 달리, 지진은 층별 유연성에 의해 최상층이 채찍처럼 튀어 지붕 가속도가 1.9배로 증폭되고 밑면전단력이 42%(2,589→3,686 kN) 폭증함을 실증.",
      file: "34_rigid_vs_flexible_whip.html",
      tags: ["채찍효과", "강체", "지진력폭증", "42%", "유연골조"]
    },
    {
      id: "05",
      act: 2,
      track: "spectrum",
      num: "정본 05",
      title: "초고층 비틀림-횡변위 연성 CQC 기하학적 절벽: 타이베이 101",
      standard: "내풍-내진 연성해석",
      badgeClass: "badge-wind",
      status: "CQC 절벽 실증",
      leadQuestion: "초고층 풍동실험과 내진설계에서 인접 모드가 비틀릴 때 발생하는 위험은?",
      desc: "풍하중 와류와 지진 비틀림으로 1·2차 모드 주기비 β>0.9로 접근할 때, 모드 사잇각이 평행(cosθ→1)해져 SRSS가 40% 과소평가하는 치명적 참사를 CQC 상관계수로 방어.",
      file: "05_cqc_geometry_cliff_taipei101.html",
      tags: ["타이베이101", "CQC", "풍동연성", "비틀림", "상관계수"]
    },
  
    {
      id: "04",
      act: 3,
      track: "modal",
      num: "정본 04",
      title: "고유분해와 Rayleigh 좌표 비연성화: 모드해석의 3대 본질",
      standard: "Rayleigh (1877)",
      badgeClass: "badge-pass",
      status: "비연성화 실증",
      leadQuestion: "층층이 얽혀 있는 다자유도 미분방정식을 어떻게 독립적으로 쪼갤 수 있을까요?",
      desc: "모드 응답=순수 단일음(Pure Tone), 모드벡터=100% 불변 공간 틀(φ₃/φ₁ 고정), 고유값=시간 속도 스케일러임을 시각화하고 물리좌표와 3개 모드를 듀얼 비교.",
      file: "04_eigen_orthogonality_decoupling.html",
      tags: ["고유값", "직교성", "비연성화", "Rayleigh", "순수단일음", "공간틀"]
    },
    {
      id: "12",
      act: 3,
      track: "modal",
      num: "정본 12",
      title: "모드 중첩 오케스트라 (Modal Superposition)",
      standard: "Chopra §10",
      badgeClass: "badge-pass",
      status: "3층 골조 모드 중첩",
      leadQuestion: "건물의 복잡한 진동 응답을 독립적인 모드의 합(화음)으로 어떻게 쪼개서 볼 수 있는가?",
      desc: "3개의 독립된 모드벡터 형상과 고유주기 진동을 슬라이더로 직접 조절하고, 이들이 중첩되어 실제 응답을 만드는 과정을 오케스트라처럼 시각화합니다.",
      file: "12_modal_superposition_orchestra.html",
      tags: ["모드중첩", "Superposition", "오케스트라", "고유주기", "형상벡터"]
    },
  
    {
      id: "W02-1",
      act: 3,
      track: "modal",
      num: "실습 W02-A",
      title: "2자유도 모드별 움직임과 동적 합성 캔버스",
      standard: "동역학2 Week 02",
      badgeClass: "badge-demo",
      status: "실습 구동형",
      leadQuestion: "1차 모드(동위상)와 2차 모드(역위상)가 합쳐지면 어떤 합성 운동이 될까요?",
      desc: "두 개의 고유 모드가 각자의 주기로 진동하면서 서로 간섭하여 복합 층변위 파형을 합성해 내는 과정을 직관적으로 체험하는 인터랙티브 실습.",
      file: "mode-demo.html",
      tags: ["2자유도", "모드합성", "동위상", "역위상", "강의실습"]
    },
    {
      id: "W02-2",
      act: 3,
      track: "modal",
      num: "실습 W02-B",
      title: "구조동역학 14대 정적 시각화 도표 뷰어",
      standard: "동역학2 Week 02",
      badgeClass: "badge-demo",
      status: "도표 색인",
      leadQuestion: "고유값 해석, 직교성 대각화, 스펙트럼 빌드업 수식 도표들을 한눈에 보려면?",
      desc: "SDOF 자유진동, 감쇠비별 위상차, 고유값 행렬 대각화, 응답스펙트럼 빌드업 등 강의 핵심 정본 SVG/PNG 도표 통합 레퍼런스.",
      file: "visuals.html",
      tags: ["시각도표", "SVG", "행렬대각화", "Chopra", "강의슬라이드"]
    },
    {
      id: "08",
      act: 3,
      track: "freq",
      num: "정본 08",
      title: "Newmark-β 수치적분법과 시간영역 적분 알고리즘 안정성",
      standard: "Newmark (1959)",
      badgeClass: "badge-pass",
      status: "수치적분 검증",
      leadQuestion: "모드분해가 통하지 않는 비선형/비탄성 시스템은 어떻게 시간을 쪼개 풀까요?",
      desc: "평균가속도법(무조건 안정, γ=1/2, β=1/4)과 선형가속도법의 시간 간격(Δt) 임계값 및 고차모드 인공 수치감쇠 효과 검증.",
      file: "08_newmark_beta_stability.html",
      tags: ["Newmark-β", "수치적분", "시간영역", "안정성", "수치감쇠"]
    },
  
    {
      id: "02",
      act: 4,
      track: "modal",
      num: "정본 02",
      title: "모드참여계수(Γn) & 유효질량(Mn*) 90% 완전성 규준",
      standard: "Chopra 12장 / KDS 41",
      badgeClass: "badge-kds",
      status: "질량보존 100%",
      leadQuestion: "건물의 전체 1,200톤 무게는 각 모드에 어떻게 분배되어 흡수될까요?",
      desc: "모드별 유효질량의 총합은 건물 전체 질량과 정확히 일치(∑Mn* ≡ Mtotal 100%)함을 입증하고, KDS 누적 90% 유효질량 참여 규준의 물리적 근거 시연.",
      file: "02_modal_participation_effective_mass.html",
      tags: ["참여계수", "유효질량", "90%규준", "질량보존", "KDS41"]
    },
    {
      id: "36",
      act: 4,
      track: "modal",
      num: "정본 36",
      title: "강체운동 지분 분해(그림 9) & 옥탑 가속도 역설",
      standard: "강의노트 §5.3.4 & §5.8",
      badgeClass: "badge-kds",
      status: "마스터노트 실증",
      leadQuestion: "밑면전단력에는 1.1%에 불과한 고차모드가 왜 옥탑방 기계실을 박살낼까요?",
      desc: "층별 강체운동 1.0의 모드별 지분 대수분해(+1.22 - 0.28 + 0.06 = 1.0) 및 최상층에서 고주파 3차 모드가 가속도의 47%를 지배하는 역설 가시화.",
      file: "36_rigid_body_participation_penthouse.html",
      tags: ["강체지분", "그림9", "옥탑가속도", "비구조요소", "고차모드역설"]
    },
  
    {
      id: "46",
      act: 5,
      track: "spectrum",
      num: "정본 46",
      title: "진자 배열 → 응답스펙트럼 생성기",
      standard: "Chopra §6.6 / KDS 41 17 00 설계스펙트럼",
      badgeClass: "badge-kds",
      status: "실시간 20-SDOF 애니메이션",
      leadQuestion: "응답스펙트럼의 점 하나하나는 어디서 오는가?",
      desc: "주기만 다른 1자유도계 20개를 같은 합성 지진파 위에 세우고 각자의 최대응답을 스펙트럼 점으로 쌓아 올린다. 감쇠비·PGA·지반형 합성파를 바꾸고 설계스펙트럼과 겹쳐 본다.",
      file: "46_spectrum_pendulum_array.html",
      tags: ["응답스펙트럼", "SDOF", "진자배열", "감쇠비", "유사가속도", "설계스펙트럼", "Newmark"]
    },
    {
      id: "39",
      act: 5,
      track: "spectrum",
      num: "정본 39",
      title: "Newmark 삼분 응답 스펙트럼 (Tripartite) & ADRS 4-in-1",
      standard: "Chopra Fig 6.6.1 / KDS 41",
      badgeClass: "badge-kds",
      status: "4축 연동 대수눈금",
      leadQuestion: "주기, 가속도, 속도, 변위를 단 하나의 그래프(4-Way)로 동시에 읽을 수 있을까요?",
      desc: "대수좌표계에서 4축(Tn, V, D, A)이 ±45도로 정렬되는 Newmark 삼분도표와 3대 민감구간, ADRS 회전 변환 및 잡음 스파이크를 걸러내는 EPA(0.1~0.5초 평균/2.5) 보정 원리.",
      file: "39_newmark_tripartite_adrs.html",
      tags: ["삼분도표", "Tripartite", "Chopra", "ADRS", "EPA", "PGA", "민감구간"]
    },
    {
      id: "45",
      act: 5,
      track: "code",
      num: "정본 45",
      title: "KDS 41 내진설계 규준 인터랙티브 네비게이터 & 7단계 의사결정 파이프라인",
      standard: "KDS 41 17 00:2022 / KDS 41 12 00",
      badgeClass: "badge-kds",
      status: "7단계 순서도 & 계산기",
      leadQuestion: "방대하고 복잡한 KDS 내진설계 조항을 하나의 직관적인 파이프라인 순서도로 파악하려면?",
      desc: "중요도(Ie) ➔ 지반(S1~S6) 증폭 ➔ SDS/SD1 & SDC(A~D) ➔ 비정형성 진단 ➔ 허용시스템·높이제한(R,Ω0,Cd) ➔ 해석법 판정 ➔ 밑면전단력 및 층간변위비까지 전과정 실시간 연산 & 순서도.",
      file: "45_kds41_seismic_code_navigator_pipeline.html",
      tags: ["KDS네비게이터", "7단계파이프라인", "SDC", "지반증폭", "비정형성", "해석법판정", "순서도", "밑면전단력", "층간변위"]
    },
    {
      id: "40",
      act: 5,
      track: "code",
      num: "정본 40",
      title: "KDS 구조해석법 선정기 & 지반(S1~S6)·비정형성 매트릭스",
      standard: "KDS 41 17 00 표 7.1-1",
      badgeClass: "badge-kds",
      status: "실시간 규준 진단",
      leadQuestion: "우리 건물은 등가정적으로 설계할 수 있을까요, 아니면 동적해석이 법적 의무일까요?",
      desc: "지반 종류(S1~S6)와 지진구역에 따른 SDC(A~D) 판정, 4대 수직비정형(연약층 Soft story, 질량, 셋백, 불연속) 입력 시 동적해석 의무화 실시간 진단.",
      file: "40_kds_analysis_method_selector.html",
      tags: ["KDS41", "해석법선정", "SDC", "지반분류", "비정형성", "SoftStory", "동적해석의무"]
    },
    {
      id: "03",
      act: 5,
      track: "spectrum",
      num: "정본 03",
      title: "다층 응답스펙트럼 해석 & 모드중첩(SRSS / CQC)",
      standard: "Chopra 13장 / KDS 41",
      badgeClass: "badge-kds",
      status: "스펙트럼 적분",
      leadQuestion: "시간 정보를 버린 대가로 찾아온 모드별 최대값들은 어떻게 다시 합쳐야 할까요?",
      desc: "지반가속도 직접 적분으로 도출된 Sa(T)로부터 모드별 최대 밑면전단력을 산출하고, 단순합산이 아닌 제곱합제곱근(SRSS)으로 합치는 확률적 이유 규명.",
      file: "03_multistory_response_spectrum.html",
      tags: ["응답스펙트럼", "El Centro", "SRSS", "CQC", "밑면전단력"]
    },
    {
      id: "35",
      act: 5,
      track: "spectrum",
      num: "반전 4",
      title: "ABSSUM = 등가정적(ELF) 완전 항등식 증명기",
      standard: "강의노트 §6.2 / 반전 4",
      badgeClass: "badge-kds",
      status: "소수점 완전일치",
      leadQuestion: "모드별 최대값을 무식하게 다 더하면(ABSSUM) 놀랍게도 무엇과 일치할까요?",
      desc: "전 모드가 스펙트럼 평탄부에 있을 때 ABSSUM ≡ V_static = 6,472 kN 소수점까지 100% 일치하며, 실제 차이는 모드 수학이 아닌 주기 하강 때문임을 슬라이더로 증명.",
      file: "35_abssum_equals_static_proof.html",
      tags: ["반전4", "ABSSUM", "등가정적", "항등식", "스펙트럼하강", "6472kN"]
    },
    {
      id: "41",
      act: 5,
      track: "code",
      num: "정본 41",
      title: "반응수정계수(R) 삼중분해 & 이중골조 25% 백업 랩",
      standard: "ATC-34 / KDS 41 표 6.2-1",
      badgeClass: "badge-kds",
      status: "2단계 생존 시뮬레이션",
      leadQuestion: "R계수는 왜 Rμ × Rs × RR로 나뉘며, 이중골조는 왜 25% 모멘트 백업을 요구할까요?",
      desc: "Newmark-Hall 연성감소 곡선(장주기 등변위 Rμ=μ, 중주기 등에너지)과 초과강도·잉여도 분해, 본진 시 전단벽 항복 후 여진에 모멘트골조가 단독 지탱하는 2단계 생존 실증.",
      file: "41_r_factor_decomposition_dual_system.html",
      tags: ["R계수", "삼중분해", "연성계수", "초과강도", "잉여도", "이중골조", "25%백업"]
    },
    {
      id: "42",
      act: 5,
      track: "code",
      num: "정본 42",
      title: "변위증폭계수(Cd)의 실체 & 비탄성 층간변위·충돌(Pounding) 랩",
      standard: "KDS 41 그림 6.8.6",
      badgeClass: "badge-kds",
      status: "충돌 파쇄 물리엔진",
      leadQuestion: "MIDAS 탄성변위(ud)로 층간변위를 검토하면 왜 건물 붕괴를 초래할까요?",
      desc: "탄성 설계변위 ud 대비 실제 소성변위 ui = Cd·ud / Ie의 증폭 비교, 1.5% 층간변위 판정 반전(OK→NG) 및 인접 건물과의 이격거리 부족 시 발생하는 지진 충돌(Pounding) 파쇄 시연.",
      file: "42_cd_deflection_amplification_inelastic_drift.html",
      tags: ["Cd계수", "변위증폭", "실제소성변위", "층간변위", "Pounding", "인접충돌"]
    },
    {
      id: "43",
      act: 5,
      track: "code",
      num: "정본 43",
      title: "고유주기의 역설: 약산주기 vs 전산주기 상한(CuTa) & MIDAS 비틀림 경고",
      standard: "KDS 41 17 00 §7.2.3",
      badgeClass: "badge-kds",
      status: "주기상한 & 3D 비틀림",
      leadQuestion: "컴퓨터가 계산한 긴 주기를 그대로 쓰면 왜 위험하며, 1차 모드 비틀림은 왜 치명적일까요?",
      desc: "컴퓨터 해석 주기 Tcom 과대평가에 따른 밑면전단력 과소평가를 CuTa 상한으로 차단하는 원리와, MIDAS Gen 1차 모드 비틀림(RZ=49.5%) 발생 시 모퉁이 기둥 응력집중 회전 가시화.",
      file: "43_period_upper_bound_torsion_warning.html",
      tags: ["약산주기", "CuTa", "주기상한", "밑면전단력방어", "MIDAS", "비틀림모드", "RZ"]
    },
    {
      id: "38",
      act: 5,
      track: "spectrum",
      num: "정본 38",
      title: "MIDAS Gen 실무용 30초 CQC 진단 & 85% Scale Factor 계산기",
      standard: "실무 설계 / KDS 41",
      badgeClass: "badge-kds",
      status: "실무 자동연산",
      leadQuestion: "내 구조물이 CQC를 써야 하는지, Scale Factor는 얼마인지 30초 만에 판정하려면?",
      desc: "모드 주기 3개만 넣으면 β>0.9 근접모드 CQC 필수 경고 및 사잇각 θ 도출, 85% 하한선 미달 시 MIDAS Gen 입력용 Scale Factor 실시간 자동 산출.",
      file: "38_midas_cqc_diagnostic_tool.html",
      tags: ["MIDAS", "CQC진단", "근접모드", "ScaleFactor", "85%보정", "실무도구"]
    },
    {
      id: "06",
      act: 5,
      track: "code",
      num: "정본 06",
      title: "등가정적(1,188 kN) vs 동적(737 kN) & KDS 85% 최소밑면전단력",
      standard: "KDS 41 17 00 §4.2",
      badgeClass: "badge-kds",
      status: "실무 4단계 매핑",
      leadQuestion: "컴퓨터 동적해석이 더 정확한데, 왜 규준은 정적의 85%로 증폭 보정하도록 규정할까요?",
      desc: "주기 불확실성과 비틀림 위험을 방어하기 위해 동적전단력을 0.85Vs까지 강제 증폭시키는 KDS 규준의 안전 철학 및 MIDAS Gen 수정 계수 산정.",
      file: "06_static_vs_dynamic_85pct_scaling.html",
      tags: ["등가정적", "85%규정", "ScaleFactor", "KDS41", "실무보정"]
    },
    {
      id: "07",
      act: 5,
      track: "spectrum",
      num: "정본 07",
      title: "2단계 포락선(Envelope)과 P-M 상관도 부호소실(Sign Loss) 함정",
      standard: "KDS 41 하중조합",
      badgeClass: "badge-kds",
      status: "P-M 부호소실 실증",
      leadQuestion: "SRSS 포락선에서 뽑은 P_max와 M_max로 기둥을 설계하면 왜 실제와 다른 과대 설계가 발생할까요?",
      desc: "1차 모달 포락선(SRSS)과 2차 하중조합 포락선(cENV)의 차이 및 P와 M의 최대 시점이 달라 발생하는 가상의 허상점(부호 소실) P-M 궤적 시각화.",
      file: "07_envelope_two_tiers.html",
      tags: ["포락선", "모달포락선", "하중조합", "cENV", "부호소실", "PM상관도"]
    },
  
    {
      id: "37",
      act: 6,
      track: "pbd",
      num: "정본 37",
      title: "Newmark 등변위 규칙 & 반응수정계수(R=5 지진력 1/5 삭감)의 실체",
      standard: "강의노트 §10 / Newmark",
      badgeClass: "badge-fema",
      status: "실시간 이력 궤적",
      leadQuestion: "지진력을 5분의 1로 깎아주는 지진력을 1/5로 경감시키는 반응수정계수(R=5)의 공학적 근거는 무엇일까요?",
      desc: "최대 횡변위(4.8 cm)는 동일하게 보존되면서도, 탄성 골조(3,686 kN) 대비 연성 골조는 소성 힌지가 항복하며 737 kN으로 힘을 억제하는 실시간 이력 궤적.",
      file: "37_newmark_equal_displacement_r_factor.html",
      tags: ["Newmark", "등변위규칙", "R계수", "이력곡선", "소성힌지", "지진력1/5"]
    },
    {
      id: "44",
      act: 6,
      track: "pbd",
      num: "정본 44",
      title: "비선형 능력스펙트럼법(CSM) & 성능점(Performance Point) 반복 수렴기",
      standard: "ATC-40 / FEMA 440",
      badgeClass: "badge-fema",
      status: "성능점 반복수렴",
      leadQuestion: "푸시오버 곡선과 지진 요구곡선은 소성 변형 시 어떻게 만나 성능점을 이룰까요?",
      desc: "Pushover 능력곡선의 ADRS 변환, 소성 힌지 항복에 따른 주기 신장(T0→Teq)과 이력감쇠 증가(βeq=5%→20%)에 의한 요구스펙트럼 수축 및 성능점 반복 수렴과 FEMA 356 한계상태 판정.",
      file: "44_capacity_spectrum_method_performance_point.html",
      tags: ["능력스펙트럼법", "CSM", "성능점", "ADRS", "Pushover", "등가감쇠", "FEMA356"]
    },
    {
      id: "24",
      act: 6,
      track: "pbd",
      num: "정본 24",
      title: "RC 기둥 P-M 상관도 & 강도감소계수(φ) 연성-취성 전이곡면",
      standard: "KDS 14 20 20 / ACI 318",
      badgeClass: "badge-pass",
      status: "상관도 정밀검증",
      leadQuestion: "지진 축력과 모멘트를 동시에 받는 철근콘크리트 기둥의 진짜 파괴 한계는?",
      desc: "중립축 c에 따른 변형률 평면 가설, Whitney 등가응력블록, 균형파괴점(Pb) 및 φ=0.65→0.85 연성·취성 전이곡면 실시간 시뮬레이션.",
      file: "24_rc_column_pm_interaction_diagram.html",
      tags: ["P-M", "강도감소계수", "균형파괴", "철근콘크리트", "KDS14"]
    },
    {
      id: "28",
      act: 6,
      track: "pbd",
      num: "정본 28",
      title: "FEMA 힌지 백본(IO-LS-CP) & 단면 200배 거시-미시 손상 통합",
      standard: "FEMA 356 / ASCE 41",
      badgeClass: "badge-fema",
      status: "거시-미시 통합",
      leadQuestion: "기둥이 항복하는 순간 거주자의 생존 여부는 공학적으로 어떻게 판정할까요?",
      desc: "거시적(Macro) A~E 백본 곡선과 미시적(Micro) 기둥 밑둥 파괴, 띠철근 간격(s/db) 물리 연동 및 거주자 생존(IO→LS→CP) HUD 동기화.",
      file: "28_fema_backbone_io_ls_cp.html",
      tags: ["FEMA", "소성힌지", "백본곡선", "IO_LS_CP", "좌굴", "생존판정"]
    },
    {
      id: "29",
      act: 6,
      track: "pbd",
      num: "정본 29",
      title: "기둥 밑둥 소성힌지 단면 200배 줌인 4단계 미시 손상역학",
      standard: "FEMA 356 Micro",
      badgeClass: "badge-fema",
      status: "4단계 미시파괴",
      leadQuestion: "강진이 기둥 밑둥을 부술 때 발생하는 물리적 파괴 순서는 어떻게 전개될까요?",
      desc: "미세 휨 균열(Hairline) → 피복 콘크리트 탈락(Spalling) → 띠철근 파단 → 주철근 S자 비탄성 좌굴(Buckling) 4단계 고해상도 렌더링.",
      file: "29_plastic_hinge_cross_section_damage.html",
      tags: ["소성힌지단면", "피복탈락", "주철근좌굴", "띠철근", "미시파괴"]
    },
    {
      id: "47",
      act: 6,
      track: "control",
      num: "정본 47",
      title: "점성댐퍼 & TMD 제진보강 효과: 부가감쇠비 · 응답저감 · F–v 이력루프",
      standard: "FEMA 356 §9.3 / ASCE 7-16 Ch.18",
      badgeClass: "badge-fema",
      status: "보강 전/후 RK4 비교",
      leadQuestion: "손상을 막기 위해 감쇠를 더하면, 지진 응답은 정말 감쇠비만큼 줄어들까요?",
      desc: "SDOF·5층 전단건물에 선형/비선형(F=C|v|^α) 점성댐퍼와 옥상 TMD를 설치해 동일 지진의 보강 전/후 응답을 비교. 에너지 등가 부가감쇠비 ζd, ASCE 7 B계수 대비 실제 저감률, 층별 배치 효율, Warburton 최적 튜닝과 FRF.",
      file: "47_viscous_damper_tmd_retrofit.html",
      tags: ["점성댐퍼", "TMD", "부가감쇠비", "제진보강", "이력루프", "B계수", "FEMA356"]
    }
  ];

  const trackById = Object.fromEntries(SIM_TRACKS.map((t, i) => [t.id, Object.assign(t, { no: i + 1 })]));
  SIMULATORS.forEach((s, i) => {
    s.step = i + 1;
    s.canonical = /^\d{2}_/.test(s.file);
    const t = trackById[s.track];
    if (!t) throw new Error("Unknown track '" + s.track + "' for simulator " + s.id);
    s.trackName = t.short;
  });

  const SIM_STATS = {
    total: SIMULATORS.length,
    canonical: SIMULATORS.filter(s => s.canonical).length,
    practice: SIMULATORS.filter(s => !s.canonical).length,
    tracks: SIM_TRACKS.length,
    acts: SIM_ACTS.length,
    byTrack: Object.fromEntries(SIM_TRACKS.map(t => [t.id, SIMULATORS.filter(s => s.track === t.id).length])),
    byAct: Object.fromEntries(SIM_ACTS.map(a => [a.act, SIMULATORS.filter(s => s.act === a.act).length]))
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  Object.assign(root, { SIMULATORS, SIM_TRACKS, SIM_ACTS, SIM_STATS });
})();
