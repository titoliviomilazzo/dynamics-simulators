/**
 * Dynamics Chart Canonical Library (정본 시각화 및 충돌 회피 차팅 엔진)
 * 
 * 정본 원칙:
 * 1. 어두운 계열 채색 절대 배제 (Zero dark fills, pure light/pastel cards)
 * 2. 변곡점/피크/데이터 곡선 비차폐 자동 여백 탐색 (4-Quadrant Clearance Scoring)
 * 3. CAD 엘보 지시선 (Elbow Leader Line) 분리
 * 4. 텍스트 너비 실측(ctx.measureText) 및 폰트 자동 스케일링
 * 5. 바닥 고정단 및 정적 캔틸레버 탄성곡선 엄밀성 준수
 */

window.DynamicsChartCanonical = (function() {
  // 정본 컬러 팔레트 (어두운 색상 일체 배제, 은은한 파스텔 & 라이트 카드)
  const PALETTE = {
    cardBg: 'rgba(255, 255, 255, 0.96)',
    cardBorder: '#cbd5e1',
    cardBorderAmber: '#f59e0b',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textAmber: '#92400e',
    tintRed: 'rgba(220, 38, 38, 0.08)',
    tintCyan: 'rgba(8, 145, 178, 0.08)',
    tintAmber: 'rgba(217, 119, 6, 0.08)',
    strokeRed: '#dc2626',
    strokeCyan: '#0891b2',
    strokeAmber: '#d97706',
    strokeGrid: '#f1f5f9',
    strokeBorder: '#e2e8f0',
    strokeGuide: '#94a3b8'
  };

  /**
   * 4방위 여백 스코어링 기반 최적 뱃지 위치 탐색 (변곡점 비차폐)
   * @param {number} targetX - 변곡점/타깃 X좌표
   * @param {number} targetY - 변곡점/타깃 Y좌표
   * @param {number} boxW - 뱃지 박스 너비
   * @param {number} boxH - 뱃지 박스 높이
   * @param {object} plotRect - { left, top, width, height } 플롯 영역
   * @param {Array<{x:number, y:number}>} curvePoints - 데이터 곡선 포인트 배열
   * @returns {{x:number, y:number}} 최적의 뱃지 좌상단 좌표
   */
  function getBestCalloutPlacement(targetX, targetY, boxW, boxH, plotRect, curvePoints = []) {
    const { left, top, width, height } = plotRect;
    
    // 4대 후보 사분면: 우상(TR), 좌상(TL), 우하(BR), 좌하(BL)
    const candidates = [
      { x: targetX + 28, y: targetY - boxH - 14 },
      { x: targetX - boxW - 28, y: targetY - boxH - 14 },
      { x: targetX + 28, y: targetY + 16 },
      { x: targetX - boxW - 28, y: targetY + 16 }
    ];

    let bestPos = null;
    let maxClearance = -Infinity;

    candidates.forEach(c => {
      // 캔버스 플롯 경계 내 안전 클램핑
      const clX = Math.max(left + 6, Math.min(left + width - boxW - 6, c.x));
      const clY = Math.max(top + 6, Math.min(top + height - boxH - 6, c.y));

      // 데이터 곡선들과의 최소 여백 거리 계산
      let minDist = Infinity;
      if (curvePoints.length > 0) {
        for (let i = 0; i < curvePoints.length; i++) {
          const pt = curvePoints[i];
          const dx = Math.max(clX - pt.x, 0, pt.x - (clX + boxW));
          const dy = Math.max(clY - pt.y, 0, pt.y - (clY + boxH));
          const d = Math.hypot(dx, dy);
          if (d < minDist) minDist = d;
        }
      } else {
        minDist = 50;
      }

      // 변곡점 자체와의 거리 (최소 20px 이상 이격하여 타깃 포인트 가림 차단)
      const distToTarget = Math.hypot((clX + boxW / 2) - targetX, (clY + boxH / 2) - targetY);
      const score = minDist * 2.0 + (distToTarget >= 22 ? 20 : -100);

      if (score > maxClearance) {
        maxClearance = score;
        bestPos = { x: clX, y: clY };
      }
    });

    return bestPos || { x: targetX + 20, y: targetY - boxH - 10 };
  }

  /**
   * 변곡점 -> 뱃지 테두리 연결 CAD 엘보 지시선 렌더링
   */
  function drawLeaderLine(ctx, startX, startY, badgeX, badgeY, boxW, boxH, color = PALETTE.strokeAmber) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 2]);

    const badgeEdgeX = startX < badgeX ? badgeX : badgeX + boxW;
    const badgeEdgeY = badgeY + boxH / 2;
    const midX = (startX + badgeEdgeX) / 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(midX, startY);
    ctx.lineTo(midX, badgeEdgeY);
    ctx.lineTo(badgeEdgeX, badgeEdgeY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 변곡점 중심 앵커 도트
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(startX, startY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * 텍스트 길이 자동 실측 및 폰트 크기 자동 조절 배지 렌더링
   */
  function drawAutoBadge(ctx, text, x, y, options = {}) {
    const {
      maxW = 280,
      baseFontSize = 9.5,
      minFontSize = 7.5,
      fontFamily = 'Pretendard, monospace',
      bg = PALETTE.cardBg,
      border = PALETTE.cardBorder,
      textColor = PALETTE.textPrimary,
      radius = 4,
      paddingX = 8,
      height = 22
    } = options;

    ctx.save();
    let fontSize = baseFontSize;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    let metrics = ctx.measureText(text);

    // 폭 초과 시 폰트 단계적 축소
    while (metrics.width + paddingX * 2 > maxW && fontSize > minFontSize) {
      fontSize -= 0.5;
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      metrics = ctx.measureText(text);
    }

    const badgeW = metrics.width + paddingX * 2;
    const badgeH = height;

    // 라이트 카드 배경
    ctx.fillStyle = bg;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, badgeW, badgeH, radius);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, badgeW, badgeH);
      ctx.strokeRect(x, y, badgeW, badgeH);
    }

    // 텍스트 수직 중앙 정렬
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + paddingX, y + badgeH / 2);
    ctx.restore();

    return { width: badgeW, height: badgeH };
  }

  return {
    PALETTE,
    getBestCalloutPlacement,
    drawLeaderLine,
    drawAutoBadge
  };
})();
