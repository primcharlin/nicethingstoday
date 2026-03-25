"use client";

import { useEffect, useMemo, useRef } from "react";
import Matter from "matter-js";

type BodySpec = {
  id: string;
  size: number;
  hue: number;
  label: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function GravityBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const specs: BodySpec[] = useMemo(
    () => [
      { id: "a", size: 64, hue: 270, label: "soft" },
      { id: "b", size: 56, hue: 25, label: "coffee" },
      { id: "c", size: 72, hue: 145, label: "sun" },
      { id: "d", size: 60, hue: 330, label: "kind" },
      { id: "e", size: 52, hue: 205, label: "rest" },
      { id: "f", size: 68, hue: 95, label: "music" },
    ],
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      Engine,
      Runner,
      World,
      Bodies,
      Body,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
    } = Matter;

    const engine = Engine.create();
    engine.gravity.x = 0;
    engine.gravity.y = 1;

    const runner = Runner.create();

    const bodies: Record<string, Matter.Body> = {};

    const createWalls = (width: number, height: number) => {
      const thickness = 200;
      const opts = { isStatic: true, restitution: 0.9, friction: 0.1 };
      return [
        Bodies.rectangle(width / 2, -thickness / 2, width, thickness, opts),
        Bodies.rectangle(
          width / 2,
          height + thickness / 2,
          width,
          thickness,
          opts,
        ),
        Bodies.rectangle(-thickness / 2, height / 2, thickness, height, opts),
        Bodies.rectangle(
          width + thickness / 2,
          height / 2,
          thickness,
          height,
          opts,
        ),
      ];
    };

    const layout = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(320, rect.width);
      const height = Math.max(320, rect.height);

      Composite.clear(engine.world, false);

      const walls = createWalls(width, height);
      World.add(engine.world, walls);

      specs.forEach((spec, index) => {
        const x = (width * (0.2 + 0.12 * index)) % (width - 80) + 40;
        const y = (height * 0.15 + index * 15) % (height - 120) + 60;
        const body = Bodies.circle(x, y, spec.size / 2, {
          restitution: 0.85,
          friction: 0.08,
          density: 0.002,
        });
        bodies[spec.id] = body;
        World.add(engine.world, body);
        Body.setAngularVelocity(body, (index % 2 ? 1 : -1) * 0.015);
      });
    };

    layout();

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.1,
        render: { visible: false },
      },
    });
    World.add(engine.world, mouseConstraint);

    let raf = 0;
    const sync = () => {
      const rect = container.getBoundingClientRect();

      for (const spec of specs) {
        const el = itemRefs.current.get(spec.id);
        const body = bodies[spec.id];
        if (!el || !body) continue;

        const x = clamp(body.position.x, -200, rect.width + 200);
        const y = clamp(body.position.y, -200, rect.height + 200);
        const angle = body.angle;

        el.style.transform = `translate3d(${x - spec.size / 2}px, ${y - spec.size / 2}px, 0) rotate(${angle}rad)`;
      }

      raf = window.requestAnimationFrame(sync);
    };

    raf = window.requestAnimationFrame(sync);
    Runner.run(runner, engine);

    const handleResize = () => layout();
    window.addEventListener("resize", handleResize);

    Events.on(engine, "beforeUpdate", () => {
      // Keep mouse position in sync with container
      const { left, top } = container.getBoundingClientRect();
      (mouse as any).offset.x = left;
      (mouse as any).offset.y = top;
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(raf);
      Runner.stop(runner);
      Engine.clear(engine);
      itemRefs.current.clear();
    };
  }, [specs]);

  return (
    <div ref={containerRef} className="gravity-bg" aria-hidden="true">
      {specs.map((spec) => (
        <div
          key={spec.id}
          ref={(node) => {
            if (!node) return;
            itemRefs.current.set(spec.id, node);
          }}
          className="gravity-item"
          style={
            {
              width: `${spec.size}px`,
              height: `${spec.size}px`,
              background: `hsla(${spec.hue}, 90%, 70%, 0.55)`,
            } as React.CSSProperties
          }
        >
          <span className="gravity-item-label">{spec.label}</span>
        </div>
      ))}
    </div>
  );
}

