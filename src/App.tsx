import { useState } from 'react';
import { WizardStep1 } from './components/WizardStep1';
import { WizardStep2 } from './components/WizardStep2';
import { WizardStep3 } from './components/WizardStep3';
import type { Step1Input, Step2Input } from './schema/wizardSchema';
import { Award, Info, Bike, ShieldCheck, Check, Calendar, MapPin, Printer } from 'lucide-react';

function App() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<{
    step1: Partial<Step1Input>;
    step2: Partial<Step2Input>;
  }>({
    step1: {},
    step2: {},
  });
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MercadoPago' | 'Transferencia' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleStep1Next = (data: Step1Input, suggestedCat: string) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setSuggestedCategory(suggestedCat);
    setStep(2);
    showToast('Paso 1 completado. Categoría sugerida cargada con éxito.');
  };

  const handleStep2Next = (data: Step2Input) => {
    setFormData((prev) => ({ ...prev, step2: data }));
    setStep(3);
    showToast('Paso 2 completado. Verifique los datos para el pago.');
  };

  const handleStep2Back = (currentData: Partial<Step2Input>) => {
    setFormData((prev) => ({ ...prev, step2: currentData }));
    setStep(1);
  };

  const handleStep3Back = () => {
    setStep(2);
  };

  const handlePaymentSuccess = (method: 'MercadoPago' | 'Transferencia', _file?: File) => {
    setPaymentMethod(method);
    setStep(4);
    if (method === 'MercadoPago') {
      showToast('¡Pago de Mercado Pago acreditado! Inscripción exitosa.');
    } else {
      showToast('¡Comprobante subido! Inscripción en revisión manual.');
    }
  };

  const handleReset = () => {
    setFormData({ step1: {}, step2: {} });
    setSuggestedCategory('');
    setPaymentMethod(null);
    setStep(1);
  };

  // Check if age is master (+65) to apply extra accessibility properties dynamically if needed
  const isMasterRider =
    formData.step1.fechaNacimiento &&
    (new Date().getFullYear() - new Date(formData.step1.fechaNacimiento).getFullYear()) >= 65;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-600 selection:text-white pb-20 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 max-w-md bg-orange-600 border border-orange-500 text-white p-5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in text-lg font-bold">
          <Info className="w-6 h-6 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Event Header */}
      <header className="relative w-full border-b border-zinc-900 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/logo.jpeg"
              alt="Logo XCO Sin Límites"
              className="w-16 h-16 rounded-xl border border-zinc-800 object-cover shadow-lg"
              onError={(e) => {
                // Fallback inside case image is missing
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                XCO <span className="text-orange-500">Sin Límites</span>
              </h1>
              <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">
                Campeonato de Mountain Bike Extremo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-bold flex items-center gap-2 text-zinc-300">
              <Calendar className="w-4 h-4 text-orange-500" /> 17 de Agosto
            </span>
            <span className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-bold flex items-center gap-2 text-zinc-300">
              <MapPin className="w-4 h-4 text-orange-500" /> Circuito Extremo
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid: Advertising image + Wizard Form */}
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Publicity Image & Race details */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10"></div>
            <img
              src="/publi.jpeg"
              alt="Publicidad Oficial de la Carrera"
              className="w-full h-auto object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-2">
              <span className="px-3 py-1 bg-orange-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg">
                Oficial
              </span>
              <h3 className="text-2xl font-black uppercase text-white tracking-wide">
                ¡Desafía tus límites!
              </h3>
              <p className="text-zinc-300 text-sm">
                Inscríbete hoy y compite en el trazado más exigente y técnico del año. Categorías especiales para todas las edades.
              </p>
            </div>
          </div>

          {/* Master Category special accessibility note card */}
          {isMasterRider && (
            <div className="bg-orange-950/40 border border-orange-500/30 rounded-3xl p-6 space-y-3">
              <h4 className="text-lg font-extrabold text-orange-400 flex items-center gap-2">
                ♿ Modo Accesibilidad Master Activo
              </h4>
              <p className="text-zinc-300 text-md">
                Hemos ajustado la interfaz para ciclistas seniors. Fuentes ampliadas, alto contraste en los textos y áreas de click extra grandes para que complete su formulario cómodamente sin fricción.
              </p>
            </div>
          )}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-md font-bold text-zinc-400 uppercase tracking-wider">
              ¿Por qué XCO Sin Límites?
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Bike className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-300 text-md">Circuito completamente señalizado y seguro.</span>
              </li>
              <li className="flex items-start gap-3">
                <Award className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-300 text-md">Medalla Finisher para todos los competidores.</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-zinc-300 text-md">Cronometraje oficial mediante chip digitalizado.</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Side: Wizard */}
        <section className="lg:col-span-8 space-y-8">
          
          {/* Step Indicator for users */}
          {step <= 3 && (
            <nav aria-label="Progreso de inscripción" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 md:p-6 shadow-xl">
              <div className="flex justify-between items-center relative">
                {/* Horizontal line connector */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-zinc-800 -z-10"></div>
                <div
                  className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-orange-600 transition-all duration-500 -z-10"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>

                {/* Step 1 indicator */}
                <button
                  onClick={() => step > 1 && setStep(1)}
                  disabled={step === 1}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-extrabold text-lg md:text-xl transition-all cursor-pointer ${
                    step >= 1
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/40 ring-4 ring-orange-900/50'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {step > 1 ? <Check className="w-6 h-6 stroke-[3]" /> : '1'}
                </button>

                {/* Step 2 indicator */}
                <button
                  onClick={() => step > 2 && setStep(2)}
                  disabled={step <= 2}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-extrabold text-lg md:text-xl transition-all ${
                    step >= 2
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/40 ring-4 ring-orange-900/50'
                      : 'bg-zinc-850 text-zinc-500 border-2 border-zinc-800'
                  }`}
                >
                  {step > 2 ? <Check className="w-6 h-6 stroke-[3]" /> : '2'}
                </button>

                {/* Step 3 indicator */}
                <button
                  disabled
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-extrabold text-lg md:text-xl transition-all ${
                    step >= 3
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/40 ring-4 ring-orange-900/50'
                      : 'bg-zinc-850 text-zinc-500 border-2 border-zinc-800'
                  }`}
                >
                  3
                </button>
              </div>

              {/* Progress Labels */}
              <div className="flex justify-between items-center text-xs md:text-sm text-zinc-400 font-bold uppercase tracking-wider mt-3 px-1">
                <span className={step >= 1 ? 'text-orange-500' : ''}>1. Datos Personales</span>
                <span className={step >= 2 ? 'text-orange-500 text-center' : 'text-center'}>2. Médicos y Categoría</span>
                <span className={step >= 3 ? 'text-orange-500 text-right' : 'text-right'}>3. Resumen y Pago</span>
              </div>
            </nav>
          )}

          {/* Render Active Wizard Step */}
          {step === 1 && (
            <WizardStep1
              initialData={formData.step1}
              onNext={handleStep1Next}
            />
          )}

          {step === 2 && (
            <WizardStep2
              initialData={formData.step2}
              suggestedCategory={suggestedCategory}
              onBack={handleStep2Back}
              onNext={handleStep2Next}
            />
          )}

          {step === 3 && (
            <WizardStep3
              formData={{
                nombre: formData.step1.nombre || '',
                apellido: formData.step1.apellido || '',
                dni: formData.step1.dni || '',
                categoria: formData.step2.categoria || '',
              }}
              onBack={handleStep3Back}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {/* Success Screen Step 4 */}
          {step === 4 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-950 border border-orange-500/30 text-orange-500 mb-2">
                <Check className="w-12 h-12 stroke-[3]" />
              </div>

              <div className="space-y-3">
                <span className="px-4 py-1 bg-orange-600/20 text-orange-400 font-extrabold text-xs uppercase tracking-widest rounded-full border border-orange-500/20">
                  ¡Cupo Asegurado!
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider">
                  ¡Inscripción Exitosa!
                </h2>
                <p className="text-zinc-300 text-lg md:text-xl max-w-xl mx-auto">
                  {paymentMethod === 'MercadoPago'
                    ? '¡Tu pago en Mercado Pago ha sido validado correctamente! Ya figuras en la lista de partida oficial.'
                    : 'Recibimos tu comprobante de transferencia bancaria de forma exitosa. Nuestro equipo auditará los fondos dentro de las 24 horas y te enviaremos una confirmación a tu email.'}
                </p>
              </div>

              {/* Race Ticket Card */}
              <div className="bg-zinc-950 border border-zinc-850 p-6 md:p-8 rounded-2xl max-w-lg mx-auto text-left space-y-4 shadow-xl relative border-l-4 border-l-orange-500">
                <div className="flex justify-between items-start border-b border-zinc-850 pb-4">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase">XCO SIN LÍMITES</h4>
                    <p className="text-xs text-zinc-500">Comprobante de Pre-inscripción Oficial</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 block font-semibold">Nº de Corredor</span>
                    <span className="text-xl font-black text-orange-500">#{(Math.floor(Math.random() * 900) + 100)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-md">
                  <div>
                    <span className="text-xs text-zinc-500 font-bold block uppercase">Competidor</span>
                    <span className="text-white font-extrabold uppercase">
                      {formData.step1.apellido}, {formData.step1.nombre}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-bold block uppercase">DNI</span>
                    <span className="text-white font-extrabold">{formData.step1.dni}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-bold block uppercase">Categoría</span>
                    <span className="text-orange-500 font-black uppercase">{formData.step2.categoria}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-500 font-bold block uppercase">Certificado Médico</span>
                    <span className={`font-black text-xs uppercase px-2 py-0.5 rounded-md inline-block ${
                      formData.step2.certificadoMedico
                        ? 'bg-green-950/40 text-green-400 border border-green-800/30'
                        : 'bg-orange-950/40 text-orange-400 border border-orange-800/30'
                    }`}>
                      {formData.step2.certificadoMedico ? '✓ Cargado' : '⚠ Pendiente en Mesa'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-zinc-500 font-bold block uppercase">Email</span>
                    <span className="text-white font-medium text-xs break-all">{formData.step1.email}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-850 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <span className="text-xs text-zinc-500 block">Método de Pago</span>
                    <span className="text-white font-bold">
                      {paymentMethod === 'MercadoPago' ? '💳 Mercado Pago' : '🏦 Transferencia'}
                    </span>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-orange-500" /> Imprimir Ficha
                  </button>
                </div>
              </div>

              <div>
                <button
                  onClick={handleReset}
                  className="h-14 px-8 bg-zinc-800 hover:bg-zinc-700 text-white text-md font-bold uppercase rounded-xl transition cursor-pointer"
                >
                  Registrar otra inscripción
                </button>
              </div>
            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default App;
