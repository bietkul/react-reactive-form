import { FormControl, FormArray, FormGroup } from './model';

export default class FormBuilder {
  /**
   * Construct a new {@link FormGroup} with the given map of configuration.
   * Valid keys for the `extra` parameter map are `validator` and `asyncValidator`.
   * @param {{[key: string]: any}} controlsConfig
   * @param {{[key: string]: any}|null} extra
   * @return {FormGroup}
   */
  group(controlsConfig, extra) {
    const controls = this._reduceControls(controlsConfig);
    const validator = extra != null ? extra.validator : null;
    const asyncValidator = extra != null ? extra.asyncValidator : null;
    return new FormGroup(controls, validator, asyncValidator);
  }
  /**
   * Construct a new {@link FormControl} with the given `formState`,`validator`, and
   * `asyncValidator`.
   *
   * `formState` can either be a standalone value for the form control or an object
   * that contains both a value and a disabled status.
   * @param {Object} formState
   * @param {Function|Function[]|null} validator
   * @param {Function|Function[]|null} asyncValidator
   * @return {FormControl}
   */
  control(formState, validator, asyncValidator) {
    return new FormControl(formState, validator, asyncValidator);
  }
  _reduceControls(controlsConfig) {
    const controls = {};
    Object.keys(controlsConfig).forEach((controlName) => {
      controls[controlName] = this._createControl(controlsConfig[controlName]);
    });
    return controls;
  }
  _createControl(controlConfig) {
    if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
        controlConfig instanceof FormArray) {
      return controlConfig;
    } else if (Array.isArray(controlConfig)) {
      const value = controlConfig[0];
      const validator = controlConfig.length > 1 ? controlConfig[1] : null;
      const asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
      return this.control(value, validator, asyncValidator);
    }
    return this.control(controlConfig);
  }
}
