const canvas = document.getElementById('roulette');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const radius = canvas.width / 2;
let animationFrameId;
let rotation = 0;
let spinningTime = 0;

function drawSector(sector, startAngle, endAngle) {
  ctx.beginPath();
  ctx.moveTo(radius, radius);
  ctx.arc(radius, radius, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = sector.color;
  ctx.fill();

  // Text
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate((startAngle + endAngle) / 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = '20px sans-serif';
  // Adjust the text position
  ctx.fillText(sector.label, radius * 0.75, 10);
  ctx.restore();
}

function drawRoulette() {
  const sectors = [
    { label: "あたり", color: "#E44C4C" },
    { label: "はずれ", color: "#4C8DE4" }
  ];
  let startAngle = 0;
  const arcSize = Math.PI / 5; // 10 sectors (5 each)
  for (let i = 0; i < 10; i++) { // Loop 10 times for 5 of each sector
    drawSector(sectors[i % 2], startAngle, startAngle + arcSize);
    startAngle += arcSize;
  }
}

function spinRoulette(timestamp) {
  if (!spinningTime) spinningTime = timestamp;
  const elapsedTime = timestamp - spinningTime;
  const totalSpinTime = 7000; // Spin for 7 seconds

  if (elapsedTime < totalSpinTime) {
    // Spin for 4 seconds and slow down for the next 3 seconds
    const timeRemaining = totalSpinTime - elapsedTime;
    const speed = timeRemaining > 3000 ? Math.PI / 15 : (Math.PI / 15) * (timeRemaining / 3000);
    rotation += speed;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(rotation);
    ctx.translate(-radius, -radius);
    drawRoulette();
    ctx.restore();
    animationFrameId = requestAnimationFrame(spinRoulette);
  } else {
    // Stop the roulette
    cancelAnimationFrame(animationFrameId);
    spinButton.disabled = true; // Disable the button after spinning
    const result = Math.random() < 0.01; // 1% chance of winning
    const resultText = result ? "おめでとうございます！トークに「当たったよ！」とコメントしてください！" : "ごめんなさい";
    alert(resultText);
  }
}

spinButton.addEventListener('click', function() {
  spinButton.disabled = true; // Disable the button on click
  spinningTime = 0; // Reset spinning time
  rotation = 0; // Reset rotation
  requestAnimationFrame(spinRoulette); // Start spinning
});

drawRoulette(); // Initial draw of the roulette
