import React, { useState } from 'react';
import { Copy, Upload, CheckCircle2, ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WizardStep3Props {
  formData: {
    nombre: string;
    apellido: string;
    dni: string;
    categoria: string;
  };
  onBack: () => void;
  onSuccess: (method: 'MercadoPago' | 'Transferencia', file?: File) => void;
}

export const WizardStep3: React.FC<WizardStep3Props> = ({ formData, onBack, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'MercadoPago' | 'Transferencia' | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = 25000;
  const alias = 'XCO.SIN.LIMITES';

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      
      if (!validTypes.includes(file.type)) {
        setFileError('Por favor suba un archivo válido (JPG, PNG o PDF).');
        setUploadedFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFileError('El archivo supera los 5MB de límite.');
        setUploadedFile(null);
        return;
      }
      
      setFileError('');
      setUploadedFile(file);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) return;

    if (paymentMethod === 'Transferencia' && !uploadedFile) {
      setFileError('Es obligatorio subir el comprobante de transferencia.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#ffffff', '#f97316', '#fb923c'],
        disableForReducedMotion: true,
      });
      // Limpia el canvas de confetti tras la animación.
      // En Samsung/WebView antiguo el canvas queda como capa negra si no se resetea.
      setTimeout(() => confetti.reset(), 3500);
      onSuccess(paymentMethod, uploadedFile || undefined);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl space-y-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-orange-500 uppercase tracking-wide border-b border-zinc-800 pb-4">
          Paso 3: Resumen y Pago
        </h2>

        {/* Resumen Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-600/10 text-orange-500 font-black text-7xl select-none translate-x-4 translate-y-2 opacity-10 uppercase font-sans">
            RACE
          </div>
          <div className="space-y-2 relative z-10">
            <span className="text-zinc-500 uppercase text-xs tracking-wider font-bold">Detalle de Inscripción</span>
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase">
              {formData.nombre} {formData.apellido}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-zinc-300 text-lg">
                DNI: <span className="font-semibold text-white">{formData.dni}</span>
              </p>
              <span className="hidden md:inline text-zinc-700">•</span>
              <p className="text-zinc-300 text-lg">
                Categoría: <span className="font-bold text-orange-500 uppercase">{formData.categoria}</span>
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto bg-zinc-900 border border-zinc-800 p-4 px-6 rounded-xl text-center md:text-right flex-shrink-0 relative z-10">
            <p className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">Total a Pagar</p>
            <p className="text-3xl md:text-4xl font-black text-orange-500">${price.toLocaleString('es-AR')}</p>
            <p className="text-xs text-zinc-500">ARS (Impuestos incluidos)</p>
          </div>
        </div>

        {/* Método de Pago Selector */}
        <div className="space-y-4">
          <label className="text-zinc-200 text-xl font-bold block">
            Seleccione el método de pago:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mercado Pago option */}
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('MercadoPago');
                setFileError('');
              }}
              className={`p-6 md:p-8 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between min-h-[15rem] cursor-pointer ${
                paymentMethod === 'MercadoPago'
                  ? 'border-orange-500 bg-orange-950/20'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start w-full gap-2">
                <span className="text-white text-2xl font-black uppercase tracking-wider">Mercado Pago</span>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'MercadoPago'}
                  onChange={() => {}}
                  className="w-6 h-6 accent-orange-500 flex-shrink-0"
                />
              </div>
              <p className="text-zinc-400 text-md py-2">
                Paga de forma rápida y segura con tarjeta de débito, crédito o dinero en cuenta de Mercado Pago.
              </p>
              <span className="text-orange-500 text-md font-bold uppercase tracking-widest flex items-center gap-1 mt-auto">
                Acreditación Inmediata ⚡
              </span>
            </button>

            {/* Transferencia option */}
            <button
              type="button"
              onClick={() => {
                setPaymentMethod('Transferencia');
                setFileError('');
              }}
              className={`p-6 md:p-8 rounded-2xl border-3 text-left transition-all relative flex flex-col justify-between min-h-[15rem] cursor-pointer ${
                paymentMethod === 'Transferencia'
                  ? 'border-orange-500 bg-orange-950/20'
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start w-full gap-2">
                <span className="text-white text-2xl font-black uppercase tracking-wider">Transferencia</span>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Transferencia'}
                  onChange={() => {}}
                  className="w-6 h-6 accent-orange-500 flex-shrink-0"
                />
              </div>
              <p className="text-zinc-400 text-md py-2">
                Realiza la transferencia desde tu homebanking y adjunta el comprobante para la validación manual de tu cupo.
              </p>
              <span className="text-zinc-400 text-md font-bold uppercase tracking-widest mt-auto">
                Acreditación en 24-48 hs 🕒
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic section based on selected method */}
        {paymentMethod === 'MercadoPago' && (
          <div className="bg-orange-950/10 border border-orange-500/20 rounded-2xl p-6 md:p-8 text-center space-y-6 animate-fade-in">
            <div className="max-w-md mx-auto space-y-4">
              <CheckCircle2 className="w-16 h-16 text-orange-500 mx-auto" />
              <h4 className="text-2xl font-black text-white uppercase tracking-wider">
                Redirección Segura a Mercado Pago
              </h4>
              <p className="text-zinc-300 text-lg">
                Haga clic en el botón de abajo para ir a la pasarela de pagos. Al finalizar, su estado de inscripción se actualizará automáticamente.
              </p>
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="w-full h-16 bg-orange-600 hover:bg-orange-500 text-white text-xl font-bold uppercase rounded-xl transition-all shadow-lg shadow-orange-950/30 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Redirigiendo...
                  </span>
                ) : (
                  <>
                    Ir a pagar con Mercado Pago
                    <ExternalLink className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {paymentMethod === 'Transferencia' && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 animate-fade-in">
            <h4 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
              Datos para la Transferencia Bancaria
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Alias Display */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3 relative overflow-hidden">
                <span className="text-xs text-zinc-500 uppercase tracking-widest block font-bold">Alias de la Cuenta</span>
                <p className="text-3xl font-black text-orange-500 select-all tracking-wider">{alias}</p>
                <button
                  type="button"
                  onClick={handleCopyAlias}
                  className="flex items-center gap-2 text-zinc-300 hover:text-white bg-zinc-950 border border-zinc-850 hover:border-zinc-700 px-4 py-2 rounded-xl text-md font-bold transition cursor-pointer"
                >
                  <Copy className="w-5 h-5 text-orange-500" />
                  {copied ? '¡Copiado!' : 'Copiar Alias'}
                </button>
              </div>

              {/* Upload field */}
              <div className="space-y-3">
                <label className="text-zinc-200 text-lg font-bold block flex items-center gap-2">
                  <Upload className="w-5 h-5 text-orange-500" /> Subir Comprobante (JPG, PNG o PDF)
                </label>
                
                <div className="relative border-2 border-dashed border-zinc-800 hover:border-orange-500/50 rounded-2xl p-6 text-center transition-all bg-zinc-900/40">
                  <input
                    type="file"
                    id="comprobante"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-2 relative z-0">
                    <FileText className="w-10 h-10 text-zinc-500 mx-auto" />
                    {uploadedFile ? (
                      <p className="text-orange-400 font-bold text-lg truncate">
                        📎 {uploadedFile.name}
                      </p>
                    ) : (
                      <>
                        <p className="text-zinc-300 text-md font-bold">
                          Arrastre o seleccione su comprobante
                        </p>
                        <p className="text-zinc-500 text-xs">
                          Límite máximo: 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {fileError && (
                  <p className="text-red-400 text-md font-semibold" role="alert">⚠️ {fileError}</p>
                )}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting || !uploadedFile}
                className="w-full h-16 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xl font-bold uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Procesando Inscripción...
                  </span>
                ) : (
                  <>
                    Finalizar Inscripción
                    <CheckCircle2 className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full md:w-auto h-16 px-10 bg-zinc-900 hover:bg-zinc-850 text-white text-xl font-bold uppercase rounded-xl transition border-2 border-zinc-800 shadow-md flex items-center justify-center gap-3 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
          Atrás
        </button>
      </div>
    </div>
  );
};
