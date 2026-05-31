import { z } from 'zod';

// Helper function to calculate age at Dec 31 of current year
export const calculateAgeAtDec31 = (birthDateString: string): number => {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return 0;
  
  const currentYear = new Date().getFullYear();
  return currentYear - birthDate.getFullYear();
};

// Suggest a category based on age at Dec 31 and gender
export const suggestCategory = (birthDateString: string, genero: 'Masculino' | 'Femenino'): 'Promocionales' | 'Élite' | 'Master' | 'Juveniles' | 'Damas' => {
  const age = calculateAgeAtDec31(birthDateString);
  
  if (genero === 'Femenino') {
    return 'Damas';
  }
  if (age < 19) {
    return 'Juveniles';
  }
  if (age >= 30) {
    return 'Master';
  }
  return 'Élite';
};

// Schema for Step 1: Datos Personales
export const step1Schema = z.object({
  nombre: z.string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El nombre es demasiado largo.' }),
  apellido: z.string()
    .min(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
    .max(50, { message: 'El apellido es demasiado largo.' }),
  dni: z.string()
    .min(6, { message: 'El DNI debe tener al menos 6 dígitos.' })
    .max(10, { message: 'El DNI debe tener como máximo 10 dígitos.' })
    .regex(/^\d+$/, { message: 'El DNI debe ser estrictamente numérico.' }),
  fechaNacimiento: z.string()
    .refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, { message: 'Fecha de nacimiento inválida.' })
    .refine((val) => {
      const age = calculateAgeAtDec31(val);
      return age >= 5 && age <= 100;
    }, { message: 'Debe tener entre 5 y 100 años al 31 de diciembre de este año.' }),
  genero: z.string().min(1, { message: 'Por favor, seleccione su género.' }),
  email: z.string()
    .email({ message: 'Ingrese un correo electrónico válido.' }),
  telefono: z.string()
    .min(8, { message: 'El teléfono debe tener al menos 8 dígitos.' })
    .regex(/^[+0-9\s-]+$/, { message: 'Ingrese un formato de teléfono válido.' }),
});

export type Step1Input = z.infer<typeof step1Schema>;

// Schema for Step 2: Categoría y Datos Médicos
export const step2Schema = z.object({
  categoria: z.string().min(1, { message: 'Por favor, seleccione una categoría.' }),
  grupoSanguineo: z.string().min(1, { message: 'Por favor, seleccione su grupo sanguíneo.' }),
  alergiasMedicacion: z.string().optional(),
  certificadoMedico: z.any()
    .refine((val) => val && (val instanceof File), {
      message: 'Es estrictamente obligatorio cargar su Certificado Médico de aptitud física.',
    }), // Mandatory medical certificate upload
  emergenciaNombre: z.string()
    .min(3, { message: 'Ingrese el nombre completo del contacto de emergencia.' }),
  emergenciaTelefono: z.string()
    .min(8, { message: 'El teléfono de emergencia debe tener al menos 8 dígitos.' })
    .regex(/^[+0-9\s-]+$/, { message: 'Ingrese un formato de teléfono válido.' }),
  deslindeAceptado: z.boolean()
    .refine((val) => val === true, {
      message: 'Es estrictamente obligatorio aceptar el Deslinde de Responsabilidad para competir.',
    }),
});

export type Step2Input = z.infer<typeof step2Schema>;

// Combined schema for the whole form wizard
export const wizardSchema = step1Schema.merge(step2Schema);
export type WizardInput = z.infer<typeof wizardSchema>;
