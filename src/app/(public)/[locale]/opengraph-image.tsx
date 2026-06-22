import {ImageResponse} from 'next/og';

export const alt = 'La Calita Beach Club';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #243b53, #2e6e8e)',
          color: '#ffffff'
        }}
      >
        <div style={{fontSize: 130, fontWeight: 800, letterSpacing: '-3px'}}>La Calita</div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            letterSpacing: '10px',
            textTransform: 'uppercase',
            color: '#e9ae74'
          }}
        >
          Beach Club · Restaurante · Cafetería
        </div>
        <div style={{marginTop: 18, fontSize: 26, opacity: 0.85}}>Salobreña · Granada</div>
      </div>
    ),
    {...size}
  );
}
