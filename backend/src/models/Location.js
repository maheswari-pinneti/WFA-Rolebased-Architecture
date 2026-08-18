import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  address: { type: String, default: null },
  city: { type: String, default: null },
  country: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' }
}, {
  timestamps: true,
  collection: 'locations'
});

export const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
export default Location;
