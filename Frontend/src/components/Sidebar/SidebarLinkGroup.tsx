import { ReactNode, useState } from 'react';

interface SidebarLinkGroupProps {
  children: (handleClick: () => void, open: boolean) => ReactNode;
  activeCondition: boolean;
}

/**
 * Renders a sidebar link group component.
 *
 * @param {Object} props - The properties for the component.
 * @param {ReactNode} props.children - The child elements to be rendered.
 * @param {boolean} props.activeCondition - The active condition for the component.
 * @return {JSX.Element} The rendered sidebar link group component.
 */
const SidebarLinkGroup = ({
  children,
  activeCondition,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
