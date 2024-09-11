import logo from "../../assets/bomber.png";
import ambulancia from "../../assets/Ambulancia.png";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Sistema de Solicitud de Emergencias 'BomberApp'</h1>
          <p className="text-xl text-gray-600 mb-8">Proteger a las comunidades con servicios de emergencia rápidos y eficaces</p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Solicita una emergencia médica
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
              { icon: "🕒", title: "Disponibilidad 24/7", description: "Servicios de urgencia las 24 horas" },
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
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { src: ambulancia, alt: "Camión de bomberos" },
              { src: ambulancia, alt: "Vehículo de rescate" },
              { src: ambulancia, alt: "Ambulancia" },
            ].map((image, index) => (
              <div key={index} className="h-48 md:h-64 flex items-center justify-center">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full max-h-40 object-contain rounded-lg shadow-md"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
