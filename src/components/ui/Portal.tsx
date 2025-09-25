import React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: Element;
}

/**
 * Portal component that renders children in a different DOM node
 * This is useful for modals, tooltips, and other overlay components
 * that need to escape their parent container's styling constraints
 */
export const Portal: React.FC<PortalProps> = ({ 
  children, 
  container = document.body 
}) => {
  return createPortal(children, container);
};