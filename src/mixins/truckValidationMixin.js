const truckValidationMixin = {
  data() {
    return {
      loadCapacityErrorStatus: false,
      truckSizeErrorStatus: false,
      validationErrorMessage: '',
      truckValidationErrorMessage: '',
      truckSize: '',
      loadCapacity: '',
    };
  },

  methods: {
    matchLoadCapacity() {
      const match = /(\d{0,2})[^.]*((?:\.\d{0,2})?)/g.exec(this.loadCapacity.replace(/[^\d.]/g, ''));
      this.loadCapacity = match[1] + match[2];
      this.validateLoadCapacity();
    },
    matchTruckSize() {
      const match = /(\d{0,2})[^.]*((?:\.\d{0,2})?)/g.exec(this.truckSize.replace(/[^\d.]/g, ''));
      this.truckSize = match[1] + match[2];
      this.validateTruckSize();
    },

    validateLoadCapacity() {
      const capacity = parseInt(this.loadCapacity, 10);
      const size = parseInt(this.truckSize, 10);

      if (this.truckSize.length === 0 && capacity > 0) {
        this.truckValidationErrorMessage = 'input the size of your truck';
        this.truckSizeErrorStatus = true;
        return false;
      }

      if (capacity === 0) {
        this.validationErrorMessage = 'input the loading capacity of the truck';
        this.loadCapacityErrorStatus = true;
        return false;
      }
      if (capacity > size) {
        this.validationErrorMessage = 'loading capacity cannot be more than the truck size';
        this.loadCapacityErrorStatus = true;

        return false;
      }
      if ((capacity < 18 || capacity > 33) && capacity <= size) {
        this.validationErrorMessage = 'loading capacity cannot be less than 18 tonnes or more than 33 tonnes';
        this.loadCapacityErrorStatus = true;
        return false;
      }

      this.loadCapacityErrorStatus = false;
      this.validationErrorMessage = '';
      return true;
    },
    validateTruckSize() {
      const size = parseInt(this.truckSize, 10);

      if (size === 0) {
        this.truckValidationErrorMessage = 'input the size of your truck';
        this.truckSizeErrorStatus = true;
        return false;
      }
      if (size < 18 || size > 33) {
        this.truckValidationErrorMessage = 'the truck size cannot be less than 18 tonnes or more than 33 tonnes';
        this.truckSizeErrorStatus = true;
        return false;
      }
      this.truckSizeErrorStatus = false;
      this.truckValidationErrorMessage = '';
      return true;
    },
  },
  tonnageValidity() {
    if (parseInt(this.vendorType, 10) === 25) {
      return this.validateLoadCapacity() && this.validateTruckSize();
    }
    return true;
  },
};

export default truckValidationMixin;
