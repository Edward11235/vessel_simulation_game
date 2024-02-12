document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas(); // Initial resize

    window.addEventListener('resize', resizeCanvas); // Resize when window size changes

    const boatSize = 0.45 * 200; // Boat size scaled for visualization
    const deltaTime = 0.01; // Simulation time step

    let boat = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        yaw: 0,
        velocity: {x: 0, y: 0, yaw: 0},
    };

    const controlInput = {surge: 0, sway: 0, yaw: 0};

    const mass = {x: 12, y: 12, yaw: 1.5};
    const damping = {x: 6, y: 6, yaw: 1.35};

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'e': controlInput.surge = 10; break;
            case 'q': controlInput.surge = -10; break;
            case 'w': controlInput.sway = 10; break;
            case 's': controlInput.sway = -10; break;
            case 'a': controlInput.yaw = -10; break;
            case 'd': controlInput.yaw = 10; break;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (['e', 'q'].includes(e.key)) controlInput.surge = 0;
        if (['w', 's'].includes(e.key)) controlInput.sway = 0;
        if (['a', 'd'].includes(e.key)) controlInput.yaw = 0;
    });

    function updatePhysics() {
        let forces = {
            x: controlInput.surge * Math.cos(boat.yaw) + controlInput.sway * Math.sin(boat.yaw),
            y: controlInput.surge * Math.sin(boat.yaw) - controlInput.sway * Math.cos(boat.yaw),
            yaw: controlInput.yaw
        };

        boat.velocity.x += (forces.x - damping.x * boat.velocity.x) / mass.x * deltaTime;
        boat.velocity.y += (forces.y - damping.y * boat.velocity.y) / mass.y * deltaTime;
        boat.velocity.yaw += (forces.yaw - damping.yaw * boat.velocity.yaw) / mass.yaw * deltaTime;

        boat.x += boat.velocity.x * deltaTime * 100;
        boat.y += boat.velocity.y * deltaTime * 100;
        boat.yaw += boat.velocity.yaw * deltaTime;
    }

    function drawBoat() {
        ctx.fillStyle = 'lightblue'; // Water background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(boat.x, boat.y);
        ctx.rotate(boat.yaw);

        ctx.fillStyle = '#0077be'; // New boat color for better contrast
        ctx.fillRect(-boatSize / 2, -boatSize / 2, boatSize, boatSize);

        ctx.beginPath();
        ctx.moveTo(0, -boatSize / 2);
        ctx.lineTo(-10, -boatSize / 4);
        ctx.lineTo(10, -boatSize / 4);
        ctx.closePath();
        ctx.fillStyle = '#ffdd57'; // New arrow color for visibility
        ctx.fill();

        ctx.restore();

        // Drawing control instructions
        drawInstructions();
    }

    function drawInstructions() {
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        const instructions = [
            'w: Move Forward',
            's: Move Backward',
            'a: Rotate Left',
            'd: Rotate Right',
            'q: Surge Left',
            'e: Surge Right'
        ];
        instructions.forEach((instruction, index) => {
            ctx.fillText(instruction, 10, canvas.height - 20 * (instructions.length - index));
        });
    }

    function gameLoop() {
        updatePhysics();
        drawBoat();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
// written by Chunlin Li