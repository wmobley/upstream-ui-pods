import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaLayerGroup } from 'react-icons/fa';
import { useInstance, ProjectInstance, Permission } from '../../../../../contexts/InstanceContext';

const PERMISSION_LABELS: Record<Permission, string> = {
  ADMIN: 'Owner',
  USER: 'Editor',
  READ: 'Viewer',
};

const PERMISSION_ORDER: Permission[] = ['ADMIN', 'USER', 'READ'];

const ProjectDropdown: React.FC = () => {
  const { instances, selectedInstance, setSelectedInstance, isLoading, error, discoveryEnabled } =
    useInstance();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!discoveryEnabled && instances.length === 0) return null;

  const grouped = PERMISSION_ORDER.reduce<Record<Permission, ProjectInstance[]>>(
    (acc, p) => {
      acc[p] = instances.filter((i) => i.permission === p);
      return acc;
    },
    { ADMIN: [], USER: [], READ: [] }
  );

  const label = isLoading
    ? 'Loading projects…'
    : error
      ? 'Projects unavailable'
      : selectedInstance
        ? selectedInstance.displayName
        : instances.length === 0
          ? 'No projects'
          : 'Select project';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-2.5 text-sm font-medium text-white transition header-button flex items-center gap-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={isLoading || instances.length === 0}
      >
        <FaLayerGroup className="text-gray-100 text-base shrink-0" />
        <span className="max-w-[14rem] truncate text-left">{label}</span>
        <FaChevronDown
          className={`text-gray-100 text-xs transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && instances.length > 0 && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-2 w-72 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-30"
        >
          {PERMISSION_ORDER.map((perm) => {
            const group = grouped[perm];
            if (group.length === 0) return null;
            return (
              <div key={perm}>
                <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {PERMISSION_LABELS[perm]}
                </p>
                {group.map((instance) => (
                  <button
                    key={instance.stackId}
                    role="option"
                    aria-selected={selectedInstance?.stackId === instance.stackId}
                    onClick={() => {
                      setSelectedInstance(instance);
                      setIsOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                      selectedInstance?.stackId === instance.stackId
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {instance.displayName}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {error && (
        <p className="absolute left-0 top-full mt-2 w-64 rounded bg-red-50 px-3 py-2 text-xs text-red-600 shadow">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProjectDropdown;
