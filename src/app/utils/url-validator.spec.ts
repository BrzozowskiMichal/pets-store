import { FormControl } from '@angular/forms';
import { optionalUrlValidator } from './url-validator';

describe('optionalUrlValidator', () => {
  let validatorFn: ReturnType<typeof optionalUrlValidator>;

  beforeEach(() => {
    validatorFn = optionalUrlValidator();
  });

  it('should return null for an empty value', () => {
    const control = new FormControl('');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return null for a valid URL', () => {
    const control = new FormControl('https://example.com');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return null for a valid URL without "https://"', () => {
    const control = new FormControl('example.com');
    expect(validatorFn(control)).toBeNull();
  });

  it('should return error for an invalid URL', () => {
    const control = new FormControl('htp:/wrong-url');
    expect(validatorFn(control)).toEqual({ invalidUrl: true });
  });

  it('should return error for a completely incorrect URL format', () => {
    const control = new FormControl('not-a-url');
    expect(validatorFn(control)).toEqual({ invalidUrl: true });
  });

  it('should return error for an incomplete URL', () => {
    const control = new FormControl('http://');
    expect(validatorFn(control)).toEqual({ invalidUrl: true });
  });

  it('should return null for a URL with a subdomain', () => {
    const control = new FormControl('https://sub.example.com/path');
    expect(validatorFn(control)).toBeNull();
  });
});
