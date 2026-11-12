import { useAuth } from '../context/AuthContext';

export default function SoloRol({ roles, children }) {
  const { tieneRol } = useAuth();

  if (!tieneRol(...roles)) {
    return null;
  }

  return children;
}
