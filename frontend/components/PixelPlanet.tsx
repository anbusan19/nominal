import React, { useEffect, useRef } from 'react';

const PixelPlanet = ({ color = "#a83a18" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Configuration
    const pixelSize = 4; // Size of the "pixels"
    const gap = 12; // Distance between pixels
    const globeRadius = 220; // Radius of the sphere
    
    // Resize handling
    const resize = () => {
      canvas.width = 800;
      canvas.height = 800;
    };
    resize();

    // Generate points on a sphere (Fibonacci Sphere algorithm)
    const createPoints = () => {
      const points = [];
      const count = 1500; // Number of pixels
      const goldenRatio = (1 + 5 ** 0.5) / 2;

      for (let i = 0; i < count; i++) {
        const theta = (2 * Math.PI * i) / goldenRatio;
        const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
        
        // Convert spherical to cartesian
        points.push({
          x: globeRadius * Math.sin(phi) * Math.cos(theta),
          y: globeRadius * Math.sin(phi) * Math.sin(theta),
          z: globeRadius * Math.cos(phi),
          baseX: globeRadius * Math.sin(phi) * Math.cos(theta),
          baseZ: globeRadius * Math.cos(phi),
        });
      }
      return points;
    };

    const points = createPoints();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Rotation Speed
      time += 0.005;

      // Rotate and Draw
      points.forEach((point) => {
        // Rotate around Y axis
        const x = point.baseX * Math.cos(time) - point.baseZ * Math.sin(time);
        const z = point.baseX * Math.sin(time) + point.baseZ * Math.cos(time);
        
        // Perspective scale (simple orthographic-ish projection for pixel look)
        const scale = (z + globeRadius * 2) / (globeRadius * 2);
        const alpha = (z + globeRadius) / (globeRadius * 2); // Fade back pixels

        // Only draw pixels in the front half or slightly behind to create volume
        // Adjusting alpha logic for "fog"
        const opacity = Math.max(0.1, Math.min(1, alpha));
        
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;

        // Draw the pixel
        if (z > -globeRadius / 1.5) { // Culling back-most pixels
            ctx.fillRect(
                cx + x, 
                cy + point.y, 
                pixelSize * (z > 0 ? 1.5 : 1), // Make front pixels slightly larger
                pixelSize * (z > 0 ? 1.5 : 1)
            );
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [color]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-contain opacity-80 mix-blend-screen"
    />
  );
};