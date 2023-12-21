import mongoose from 'mongoose';

const mockPatientSchema = mongoose.Schema({
    patientId: Number,
    images: [
      {
        description: String,
        data: Buffer,
        contentType: String,
      },
    ],
  });

mockPatientSchema.statics.findOne = jest.fn();
mockPatientSchema.methods.save = jest.fn();

const mockPatient = mongoose.model('MockPatient', mockPatientSchema);
export const Patient = mockPatient;
