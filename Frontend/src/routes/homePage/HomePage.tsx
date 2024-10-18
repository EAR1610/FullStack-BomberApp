import { useState } from "react";
import { Link } from "react-router-dom";
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria';
import logo from "../../assets/bomber.png";
import ambulancia from "../../assets/Ambulancia.jpg";
import bus from "../../assets/Bus.jpg";
import motobomba from "../../assets/Motobomba.jpg";
import { Button } from "primereact/button";

export default function Homepage() {    
    const [images] = useState([
      {
          itemImageSrc: bus,
          thumbnailImageSrc: bus,
          alt: 'Bus de bomberos'
      },
      {
          itemImageSrc: motobomba,
          thumbnailImageSrc: motobomba,
          alt: 'Motobomba'
      },
      {
          itemImageSrc: ambulancia,
          thumbnailImageSrc: ambulancia,
          alt: 'Ambulancia'
      }
    ]);
    const responsiveOptions: GalleriaResponsiveOptions[] = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

  const itemTemplate = (item: any) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
  }

  const thumbnailTemplate = (item: any) => {
    return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ width: '100%', objectFit: 'cover' }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Sistema de Solicitud de Emergencias 'BomberApp'</h1>
          <p className="text-xl text-gray-600 mb-8">Proteger a las comunidades con servicios de emergencia rápidos y eficaces</p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            <Link className="block flex-shrink-0" to="./login">
                Solicita una emergencia médica
            </Link>
          </button>
        </section>

        <section className="flex flex-col md:flex-row gap-8 mb-16">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Nuestra misión</h2>
            <p className="text-gray-600 mb-4">
              En BomberApp, nos comprometemos a salvaguardar vidas, propiedades y el medio ambiente mediante una respuesta rápida, tecnología avanzada y formación continua. Nuestro dedicado equipo de bomberos está listo 24/7 para servir a nuestra comunidad en tiempos de crisis.
            </p>
          </div>
          <div className="md:w-1/2 flex items-center justify-center">
            <img
              src={logo}
              alt="57a Compañia de Bomberos de Guatemala"
              className="w-full max-h-60 object-contain rounded-lg shadow-lg"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Nuestras principales características</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🔥", title: "Respuesta rápida", description: "El tiempo para realizar una solicitud es menor a 10 segundos." },
              { icon: "🛡️", title: "Equipo Avanzado", description: "Equipos de extinción de incendios y salvamento de última generación" },
              { icon: "🕒", title: "Disponibilidad 24/7", description: "Servicios de urgencia las 24 horas. Puede solicitar una emergencia: 7926-0177 o 7926-3054" },
              { icon: "📞", title: "Informes sencillos", description: "Sistema de notificación de emergencias fácil de usar" },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Nuestras unidades</h2>
          <div className="card">
            <Galleria 
                value={images}
                responsiveOptions={responsiveOptions} 
                numVisible={3} 
                style={{ maxWidth: '100%' }}
                item={itemTemplate} 
                thumbnail={thumbnailTemplate}
                circular 
                autoPlay 
                transitionInterval={2000} 
            />
          </div>
        </section>

      </main>
    </div>
  )
}
