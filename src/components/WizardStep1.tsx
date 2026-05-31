import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, calculateAgeAtDec31, suggestCategory } from '../schema/wizardSchema';
import type { Step1Input } from '../schema/wizardSchema';
import { User, CreditCard, Calendar, VenusAndMars, Mail, Phone, ArrowRight } from 'lucide-react';

interface WizardStep1Props {
  initialData: Partial<Step1Input>;
  onNext: (data: Step1Input, suggestedCat: string) => void;
}

export const WizardStep1: React.FC<WizardStep1Props> = ({ initialData, onNext }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step1Input>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nombre: initialData.nombre || '',
      apellido: initialData.apellido || '',
      dni: initialData.dni || '',
      fechaNacimiento: initialData.fechaNacimiento || '',
      genero: initialData.genero || '',
      email: initialData.email || '',
      telefono: initialData.telefono || '',
    },
  });

  const watchBirthDate = watch('fechaNacimiento');
  const watchGenero = watch('genero');

  // Compute live age at Dec 31
  const ageAtDec31 = watchBirthDate ? calculateAgeAtDec31(watchBirthDate) : null;
  const recommendedCategory = (watchBirthDate && watchGenero && (watchGenero === 'Masculino' || watchGenero === 'Femenino')) 
    ? suggestCategory(watchBirthDate, watchGenero as 'Masculino' | 'Femenino') 
    : null;

  const onSubmit = (data: Step1Input) => {
    const suggested = (watchBirthDate && watchGenero && (watchGenero === 'Masculino' || watchGenero === 'Femenino'))
      ? suggestCategory(watchBirthDate, watchGenero as 'Masculino' | 'Femenino')
      : 'Promocionales';
    onNext(data, suggested);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-10 shadow-xl space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-orange-500 uppercase tracking-wide border-b border-zinc-800 pb-4">
          Paso 1: Datos Personales
        </h2>
        <p className="text-zinc-400 text-lg">
          Por favor, ingrese sus datos personales tal como figuran en su DNI. Estos datos se utilizarán para validar su categoría de competencia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="nombre" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" /> Nombre
            </label>
            <input
              id="nombre"
              type="text"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              placeholder="Ej. Juan"
              {...register('nombre')}
            />
            {errors.nombre && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.nombre.message}</span>
            )}
          </div>

          {/* Apellido */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="apellido" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" /> Apellido
            </label>
            <input
              id="apellido"
              type="text"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              placeholder="Ej. Pérez"
              {...register('apellido')}
            />
            {errors.apellido && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.apellido.message}</span>
            )}
          </div>

          {/* DNI */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="dni" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" /> DNI (Sólo números)
            </label>
            <input
              id="dni"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              placeholder="Ej. 12345678"
              {...register('dni')}
            />
            {errors.dni && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.dni.message}</span>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="fechaNacimiento" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" /> Fecha de Nacimiento
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              {...register('fechaNacimiento')}
            />
            {errors.fechaNacimiento && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.fechaNacimiento.message}</span>
            )}

            {/* Live calculated age & category suggestion display */}
            {ageAtDec31 !== null && ageAtDec31 > 0 && ageAtDec31 <= 100 && (
              <div className="mt-2 bg-orange-950/40 border border-orange-800/40 rounded-lg p-3 text-sm md:text-md text-orange-300">
                <p className="font-semibold">
                  Edad calculada al 31/12 de este año: <span className="text-white text-lg font-bold">{ageAtDec31} años</span>
                </p>
                {ageAtDec31 >= 65 && (
                  <p className="text-white font-medium mt-1">
                    ⚠️ ¡Atención Ciclista Master! Se aplicará tipografía de alto contraste y soporte especial.
                  </p>
                )}
                {recommendedCategory && (
                  <p className="mt-1">
                    Categoría sugerida automáticamente: <span className="text-orange-400 font-bold uppercase">{recommendedCategory}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Género */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="genero" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <VenusAndMars className="w-5 h-5 text-orange-500" /> Género
            </label>
            <select
              id="genero"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ea580c\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em', backgroundRepeat: 'no-repeat' }}
              {...register('genero')}
            >
              <option value="">Seleccione Género...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
            {errors.genero && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.genero.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-500" /> Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              placeholder="correo@ejemplo.com"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.email.message}</span>
            )}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col space-y-2 md:col-span-2">
            <label htmlFor="telefono" className="text-zinc-200 text-lg font-semibold flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" /> Teléfono Móvil (Con código de área, sin 0 ni 15)
            </label>
            <input
              id="telefono"
              type="tel"
              className="w-full bg-zinc-950 border-2 border-zinc-800 hover:border-zinc-700 text-white rounded-xl h-14 px-4 text-lg transition-all focus:border-orange-500 focus:outline-none"
              placeholder="Ej. +54 9 261 5555555"
              {...register('telefono')}
            />
            {errors.telefono && (
              <span className="text-red-400 text-md font-medium" role="alert">{errors.telefono.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="w-full md:w-auto h-16 px-10 bg-orange-600 hover:bg-orange-500 text-white text-xl font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-orange-950/50 flex items-center justify-center gap-3 cursor-pointer group"
        >
          Siguiente Paso
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
};
