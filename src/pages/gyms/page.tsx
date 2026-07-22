import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, MapPin, Building2 } from 'lucide-react';

export default function GymsPage() {
  const handleAddGym = () => {
    const name = prompt("Enter new gym/studio name:");
    if (!name) return;
    const location = prompt("Enter location address:");
    if (!location) return;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Gyms & Facilities" 
        category="Infrastructure" 
        action={
          <Button variant="primary" onClick={handleAddGym} className="gap-2">
            <Plus size={14} />
            <span>Add Gym</span>
          </Button>
        }
      />

      {/* Map Placeholder Area */}
      <div className="space-y-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          GEOGRAPHICAL REGISTRY MAP
        </div>
        <div 
          style={{
            height: '200px',
            backgroundColor: 'var(--bg-hover)',
            border: '0.5px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          className="relative overflow-hidden group"
        >
          {/* Subtle architectural background grids for map view */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />
          <MapPin size={24} className="text-[var(--text-muted)] group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent)' }} />
          <span className="text-[12px] text-[var(--text-muted)] font-medium">Map view coming soon</span>
          <span className="text-[10px] text-[var(--text-placeholder)] font-mono uppercase">biometric GPS disabled</span>
        </div>
      </div>

      {/* Gym Cards Grid */}
      <div className="space-y-4">
        <div className="text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase font-semibold">
          REGISTERED ESTABLISHMENTS
        </div>

        <Card className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <Building2 size={40} className="text-[var(--text-muted)] opacity-60" />
          <div className="space-y-1">
            <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">Facility data unavailable</h3>
            <p className="text-[12px] text-[var(--text-muted)] max-w-xs">
              Facility listing is not connected.
            </p>
          </div>
          <Button variant="primary" onClick={handleAddGym}>
            Register Establishment
          </Button>
        </Card>
      </div>
    </div>
  );
}
