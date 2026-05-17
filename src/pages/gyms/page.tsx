import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Plus, MapPin, Building2, TrendingUp, Users } from 'lucide-react';

const MOCK_GYMS = [
  { 
    id: '1', 
    name: 'Titan Fitness Principal', 
    location: '102 El Camino Real, Menlo Park, CA', 
    members: 242, 
    activeSubs: 162, 
    revenue: '₹18,500', 
    status: 'ACTIVE' 
  },
  { 
    id: '2', 
    name: 'Titan Fitness Downtown', 
    location: '540 University Ave, Palo Alto, CA', 
    members: 118, 
    activeSubs: 86, 
    revenue: '₹11,200', 
    status: 'ACTIVE' 
  }
];

export default function GymsPage() {
  const [gyms, setGyms] = useState(MOCK_GYMS);

  const handleAddGym = () => {
    const name = prompt("Enter new gym/studio name:");
    if (!name) return;
    const location = prompt("Enter location address:");
    if (!location) return;

    const newGym = {
      id: String(gyms.length + 1),
      name,
      location,
      members: 0,
      activeSubs: 0,
      revenue: '₹0',
      status: 'ACTIVE'
    };
    setGyms([...gyms, newGym]);
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

        {gyms.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <Building2 size={40} className="text-[var(--text-muted)] opacity-60" />
            <div className="space-y-1">
              <h3 className="text-[14px] font-semibold text-[var(--text-secondary)]">No establishments registered</h3>
              <p className="text-[12px] text-[var(--text-muted)] max-w-xs">
                Register your first gym or wellness space to initialize capacity statistics.
              </p>
            </div>
            <Button variant="primary" onClick={handleAddGym}>
              Register Establishment
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {gyms.map((gym) => (
              <Card key={gym.id} className="relative flex flex-col justify-between hover:border-[var(--accent)] transition-all duration-300">
                {/* Active status top-right */}
                <div className="absolute top-4 right-4">
                  <Badge variant={gym.status === 'ACTIVE' ? 'healthy' : 'muted'}>
                    {gym.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-[16px] font-medium text-[var(--text-primary)] pr-16 truncate">
                      {gym.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
                      <MapPin size={12} className="text-[var(--text-muted)] flex-shrink-0" />
                      <span className="truncate">{gym.location}</span>
                    </div>
                  </div>

                  {/* Inline Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-[var(--bg-hover)] rounded-[var(--radius-md)] border border-[var(--border-default)] text-[12px]">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider block">Members</span>
                      <div className="flex items-center gap-1 font-semibold text-[var(--text-primary)] font-mono">
                        <Users size={12} className="text-[var(--text-muted)]" />
                        <span>{gym.members}</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider block">Active Subs</span>
                      <div className="flex items-center gap-1 font-semibold text-[var(--text-primary)] font-mono">
                        <Building2 size={12} className="text-[var(--text-muted)]" />
                        <span>{gym.activeSubs}</span>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider block">Revenue</span>
                      <div className="flex items-center gap-1 font-semibold text-[var(--accent)] font-mono">
                        <TrendingUp size={12} className="text-[var(--text-muted)]" />
                        <span>{gym.revenue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[var(--border-default)] flex items-center justify-end">
                  <Button variant="ghost" className="text-[12px] font-semibold text-[var(--accent)]">
                    MANAGE FACILITY
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
