import { PET_STATUS_MAP } from '../misc/status-labels-map';
import { PetStatusPipe } from './pet-status.pipe';

describe('PetStatusPipe', () => {
  let pipe: PetStatusPipe;

  beforeEach(() => {
    pipe = new PetStatusPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "available" to correct label', () => {
    expect(pipe.transform('available')).toBe(PET_STATUS_MAP['available']);
  });

  it('should transform "sold" to correct label', () => {
    expect(pipe.transform('sold')).toBe(PET_STATUS_MAP['sold']);
  });

  it('should transform "pending" to correct label', () => {
    expect(pipe.transform('pending')).toBe(PET_STATUS_MAP['pending']);
  });

  it('should return "Nieznany" for an invalid status', () => {
    expect(pipe.transform('invalid_status')).toBe('Nieznany');
  });
});
