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

  it('should transform "available" to correct label and color', () => {
    const result = pipe.transform('available');
    expect(result).toEqual({
      label: PET_STATUS_MAP['available'],
      color: 'green',
    });
  });

  it('should transform "sold" to correct label and color', () => {
    const result = pipe.transform('sold');
    expect(result).toEqual({
      label: PET_STATUS_MAP['sold'],
      color: 'red',
    });
  });

  it('should transform "pending" to correct label and color', () => {
    const result = pipe.transform('pending');
    expect(result).toEqual({
      label: PET_STATUS_MAP['pending'],
      color: 'orange',
    });
  });

  it('should return default label and color for an invalid status', () => {
    const result = pipe.transform('invalid_status');
    expect(result).toEqual({
      label: 'Nieznany',
      color: 'grey',
    });
  });
});
