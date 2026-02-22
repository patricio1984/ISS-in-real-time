import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './CustomCursor.css';

const CustomCursor = () => {
	const cursorRef = useRef(null);
	const dotRef = useRef(null);
	const [portalNode, setPortalNode] = useState(null);
	
	// Track actual mouse position
	const mouse = useRef({ x: -100, y: -100 });
	// Track smoothed position for the ring
	const smoothMouse = useRef({ x: -100, y: -100 });

	useEffect(() => {
		// Create a container outside of body to avoid CSS transform/perspective issues
		const node = document.createElement('div');
		node.id = 'custom-cursor-container';
		document.documentElement.appendChild(node);
		setPortalNode(node);

		return () => {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		};
	}, []);

	useEffect(() => {
		if (!portalNode) return;

		// Disable custom cursor on touch devices
		if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
			return;
		}

		const onMouseMove = (e) => {
			// Use clientX/Y because the portal is outside any transformed containers
			mouse.current.x = e.clientX;
			mouse.current.y = e.clientY;
			
			// Instantly move the center dot for zero perceived latency
			if (dotRef.current) {
				dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
			}
		};

		const onMouseOver = (e) => {
			const target = e.target;
			// Check if hovering over an interactive element
			const isClickable = target.closest('a, button, input, select, textarea, [role="button"], .leaflet-interactive, .leaflet-control, .menuitem, .bm-burger-button, .menu-toggle-btn, .menu-link, .dark-mode-toggle');
			
			if (isClickable && cursorRef.current) {
				cursorRef.current.classList.add('is-hovering');
			} else if (cursorRef.current) {
				cursorRef.current.classList.remove('is-hovering');
			}
		};

		const onMouseDown = () => {
			if (cursorRef.current) cursorRef.current.classList.add('is-clicking');
		};

		const onMouseUp = () => {
			if (cursorRef.current) cursorRef.current.classList.remove('is-clicking');
		};

		window.addEventListener('pointermove', onMouseMove, { passive: true, capture: true });
		window.addEventListener('pointerover', onMouseOver, { passive: true, capture: true });
		window.addEventListener('pointerdown', onMouseDown, { passive: true, capture: true });
		window.addEventListener('pointerup', onMouseUp, { passive: true, capture: true });

		let animationFrameId;
		
		// Render loop for the smooth trailing ring
		const render = () => {
			// Linear interpolation (lerp) for smooth following effect
			smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.15;
			smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.15;

			if (cursorRef.current) {
				cursorRef.current.style.transform = `translate3d(${smoothMouse.current.x}px, ${smoothMouse.current.y}px, 0)`;
			}
			
			animationFrameId = requestAnimationFrame(render);
		};
		
		render();

		return () => {
			window.removeEventListener('pointermove', onMouseMove, { capture: true });
			window.removeEventListener('pointerover', onMouseOver, { capture: true });
			window.removeEventListener('pointerdown', onMouseDown, { capture: true });
			window.removeEventListener('pointerup', onMouseUp, { capture: true });
			cancelAnimationFrame(animationFrameId);
		};
	}, [portalNode]);

	if (!portalNode) return null;

	return createPortal(
		<>
			<div ref={dotRef} className="custom-cursor-dot"></div>
			<div ref={cursorRef} className="custom-cursor-ring">
				<div className="crosshair top"></div>
				<div className="crosshair bottom"></div>
				<div className="crosshair left"></div>
				<div className="crosshair right"></div>
			</div>
		</>,
		portalNode
	);
};

export default CustomCursor;
