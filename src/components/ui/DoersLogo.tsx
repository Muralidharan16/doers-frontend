export function DoersLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        style={{ 
          width: '44px', 
          height: '44px', 
          backgroundColor: 'var(--accent)', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <img 
          src="/doers_icon_light.png" 
          alt="Doers" 
          className="w-[22px] h-[22px] object-contain" 
          style={{ filter: 'brightness(0) invert(1)', border: 'none' }} 
        />
      </div>
      <div className="text-center">
        <span className="font-serif text-[18px] font-medium tracking-tight text-[var(--text-primary)] leading-none block mb-0.5">Doers</span>
        <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] leading-none">STUDIO OS</div>
      </div>
    </div>
  );
}
