import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema } from '../schema/wizardSchema';
import type { Step2Input } from '../schema/wizardSchema';
import { ShieldAlert, Activity, Heart, User, Phone, ArrowLeft, ArrowRight, Upload, FileText, CheckCircle } from 'lucide-react';

interface WizardStep2Props {
  initialData: Partial<Step2Input>;
  suggestedCategory: string;
  onBack: (data: Partial<Step2Input>) => void;
  onNext: (data: Step2Input) => void;
}

export const WizardStep2: React.FC<WizardStep2Props> = ({ initialData, suggestedCategory, onBack, onNext }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(initialData.certificadoMedico || null);
  const [fileError, setFileError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<Step2Input>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      categoria: initialData.categoria || suggestedCategory || '',
      grupoSanguineo: initialData.grupoSanguineo || '',
      alergiasMedicacion: initialData.alergiasMedicacion || '',
      certificadoMedico: initialData.certificadoMedico || undefined,
      emergenciaNombre: initialData.emergenciaNombre || '',
      emergenciaTelefono: initialData.emergenciaTelefono || '',
      deslindeAceptado: initialData.deslindeAceptado || false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      
      if (!validTypes.includes(file.type)) {
        setFileError('Por favor suba una imagen válida (JPG, PNG) o PDF.');
        setSelectedFile(null);
        setValue('certificadoMedico', undefined);
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setFileError('El archivo supera los 5MB.');
        setSelectedFile(null);
        setValue('certificadoMedico', undefined);
        return;
      }
      
      setFileError('');
      setSelectedFile(file);
      setValue('certificadoMedico', file);
    }
  };

  const onSubmit: SubmitHandler<Step2Input> = (data) => {
    onNext(data);
  };

  const handleBack = () => {
    // Save current values before going back
    const currentValues = getValues();
    onBack(currentValues);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-orange-500 uppercase tracking-wide border-b border-zinc-800 pb-4">
          Paso 2: Categoría y Datos Médicos
        </h2>
        <p className="text-zinc-400 text-lg">
          La seguridad es lo primero. Complete su información médica y el contacto de emergencia en caso de incidentes en la pista de XCO.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categoría de Competencia */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="categoria" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" /> Categoría de Carrera
            </label>
            <select
              id="categoria"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ea580c\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em', backgroundRepeat: 'no-repeat' }}
              {...register('categoria')}
            >
              <option value="">Seleccione Categoría...</option>
              <option value="Promocionales">Promocionales (Amateur / Principiantes)</option>
              <option value="Élite">Élite (Profesional / Libre)</option>
              <option value="Master">Master (Mayores de 30 años)</option>
              <option value="Juveniles">Juveniles (Menores de 19 años)</option>
              <option value="Damas">Damas (Femenino general)</option>
            </select>
            {suggestedCategory && (
              <span className="text-sm text-orange-400/90 font-medium">
                ⭐ Categoría sugerida por el sistema: <span className="underline font-bold uppercase">{suggestedCategory}</span>
              </span>
            )}
            {errors.categoria && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.categoria.message}</span>
            )}
          </div>

          {/* Grupo Sanguíneo */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="grupoSanguineo" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <Heart className="w-5 h-5 text-orange-500" /> Grupo Sanguíneo
            </label>
            <select
              id="grupoSanguineo"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ea580c\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em', backgroundRepeat: 'no-repeat' }}
              {...register('grupoSanguineo')}
            >
              <option value="">Seleccione Factor...</option>
              <option value="A+">A Positivo (A+)</option>
              <option value="A-">A Negativo (A-)</option>
              <option value="B+">B Positivo (B+)</option>
              <option value="B-">B Negativo (B-)</option>
              <option value="AB+">AB Positivo (AB+)</option>
              <option value="AB-">AB Negativo (AB-)</option>
              <option value="O+">O Positivo (O+)</option>
              <option value="O-">O Negativo (O-)</option>
            </select>
            {errors.grupoSanguineo && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.grupoSanguineo.message}</span>
            )}
          </div>

          {/* Alergias o Medicación */}
          <div className="flex flex-col space-y-2 md:col-span-2">
            <label htmlFor="alergiasMedicacion" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-500" /> Alergias, Medicación Crónica o Observaciones Médicas (Opcional)
            </label>
            <textarea
              id="alergiasMedicacion"
              rows={3}
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl p-4 text-lg transition-all focus:border-orange-500 focus:outline-none resize-none"
              placeholder="Indique si es alérgico a algún medicamento, posee alguna patología o toma medicamentos de forma diaria..."
              {...register('alergiasMedicacion')}
            />
          </div>

          {/* Certificado Médico (Obligatorio) */}
          <div className="flex flex-col space-y-2 md:col-span-2 bg-zinc-950/40 p-5 rounded-2xl border border-zinc-800/80">
            <label className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-500" /> Subir Certificado Médico de Aptitud Física (Obligatorio)
            </label>
            <p className="text-zinc-500 text-sm">
              Suba una foto clara o archivo PDF de su certificado de aptitud física firmado por un profesional matriculado. Este requisito es estrictamente obligatorio para poder competir.
            </p>
            
            <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-zinc-900/20 mt-2 ${
              errors.certificadoMedico ? 'border-red-500/50 hover:border-red-500' : 'border-zinc-800 hover:border-orange-500/50'
            }`}>
              <input
                type="file"
                id="certificadoMedico"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-2 relative z-0">
                <FileText className="w-10 h-10 text-zinc-500 mx-auto" />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-500" />
                    <p className="text-orange-400 font-bold text-md truncate max-w-xs md:max-w-md">
                      {selectedFile.name}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-zinc-300 text-sm font-bold">
                      Seleccionar o arrastrar certificado médico obligatorio
                    </p>
                    <p className="text-zinc-500 text-xs">
                      JPG, PNG o PDF (Máx. 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
            {errors.certificadoMedico?.message && (
              <p className="text-red-400 text-md font-bold mt-2" role="alert">
                ⚠️ {String(errors.certificadoMedico.message)}
              </p>
            )}
            {fileError && (
              <p className="text-red-400 text-md font-bold mt-2" role="alert">⚠️ {fileError}</p>
            )}
          </div>

          <div className="md:col-span-2 border-t border-zinc-800 pt-6 my-2">
            <h3 className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
              🚨 Contacto de Emergencia
            </h3>
          </div>

          {/* Contacto de Emergencia - Nombre */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="emergenciaNombre" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" /> Nombre del Contacto
            </label>
            <input
              id="emergenciaNombre"
              type="text"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              placeholder="Ej. María López (Madre / Cónyuge)"
              {...register('emergenciaNombre')}
            />
            {errors.emergenciaNombre && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.emergenciaNombre.message}</span>
            )}
          </div>

          {/* Contacto de Emergencia - Teléfono */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="emergenciaTelefono" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" /> Teléfono de Contacto
            </label>
            <input
              id="emergenciaTelefono"
              type="tel"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              placeholder="Ej. +54 9 261 6666666"
              {...register('emergenciaTelefono')}
            />
            {errors.emergenciaTelefono && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.emergenciaTelefono.message}</span>
            )}
          </div>

          {/* Giant deslinde de responsabilidad checkbox */}
          <div className="md:col-span-2 bg-zinc-950/80 border border-red-500/20 rounded-2xl p-6 mt-4 space-y-4">
            <h3 className="text-xl font-black text-red-500 uppercase tracking-wider flex items-center gap-2">
              ⚠️ Deslinde de Responsabilidad Legal
            </h3>
            <div className="max-h-36 overflow-y-auto text-zinc-400 text-sm md:text-md space-y-2 bg-zinc-900/60 p-4 rounded-xl border border-zinc-850">
              <p>
                Al tildar el siguiente casillero, el participante declara bajo juramento estar en perfectas condiciones físicas, psíquicas y de entrenamiento para disputar la competencia de ciclismo de montaña extrema denominada <strong>"XCO Sin Límites"</strong>.
              </p>
              <p>
                Libera expresamente a la organización del evento, sponsors, auspiciantes, municipalidades locales y propietarios de los terrenos de cualquier tipo de reclamo legal, indemnización por accidentes, pérdidas materiales, golpes, fracturas o cualquier contingencia de salud que pudiera ocurrir durante el desarrollo de la prueba deportiva en este exigente circuito cerrado.
              </p>
              <p>
                Asimismo, se compromete al uso obligatorio de casco rígido homologado, indumentaria adecuada y una bicicleta de montaña que cumpla con los estándares mínimos de seguridad requeridos por los comisarios deportivos.
              </p>
            </div>
            
            <div className="flex items-start gap-4 pt-2">
              <input
                id="deslindeAceptado"
                type="checkbox"
                className="w-8 h-8 rounded-lg border-2 border-zinc-700 text-orange-500 bg-zinc-950 focus:ring-orange-500 focus:ring-offset-zinc-900 transition cursor-pointer accent-orange-600 mt-1 flex-shrink-0"
                {...register('deslindeAceptado')}
              />
              <label htmlFor="deslindeAceptado" className="text-zinc-200 text-lg md:text-xl font-bold cursor-pointer select-none">
                ACEPTO LOS TÉRMINOS Y CONDICIONES Y EL DESLINDE DE RESPONSABILIDAD LEGAL (Obligatorio)
              </label>
            </div>
            {errors.deslindeAceptado && (
              <p className="text-red-400 text-md font-bold mt-2" role="alert">
                ⚠️ {errors.deslindeAceptado.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="h-16 bg-zinc-900 hover:bg-zinc-850 text-white text-xl font-bold uppercase rounded-xl transition border-2 border-zinc-800 shadow-md flex items-center justify-center gap-3 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
          Atrás
        </button>
        <button
          type="submit"
          className="h-16 bg-orange-600 hover:bg-orange-500 text-white text-xl font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-orange-950/50 flex items-center justify-center gap-3 cursor-pointer group"
        >
          Siguiente Paso
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};
