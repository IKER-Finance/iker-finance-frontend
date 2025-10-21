'use client';

import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Image from 'next/image';

export default function UnderConstruction({ pageName = "This Page" }) {
  const router = useRouter();

  return (
    <div className="surface-ground" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 60px)',
      padding: '2rem'
    }}>
      <Card style={{ maxWidth: '600px', textAlign: 'center', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', position: 'relative', width: '100%', height: '300px' }}>
          <Image
            src="/images/under-construction.png"
            alt="Under Construction"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
          Work in Progress
        </h1>
        
        <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem' }}>
          {pageName} is currently under construction.<br/>
          We&apos;re working hard to bring you this feature soon!
        </p>
        
        <Button 
          label="Go Back to Dashboard" 
          icon="pi pi-home" 
          onClick={() => router.push('/dashboard/overview')}
        />
      </Card>
    </div>
  );
}