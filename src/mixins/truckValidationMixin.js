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
      const capacity = parseFloat(this.loadCapacity);
      const size = parseInt(this.truckSize, 10);

      if (this.truckSize.length === 0 && capacity > 0) {
        this.truckValidationErrorMessage = this.$t('truckValidationMxn.input_truck_size');
        this.truckSizeErrorStatus = true;
        return false;
      }

      if (capacity === 0) {
        this.validationErrorMessage = this.$t('truckValidationMxn.input_loading_capacity');
        this.loadCapacityErrorStatus = true;
        return false;
      }
      if (capacity > size) {
        this.validationErrorMessage = this.$t('truckValidationMxn.loading_capacity_more_than_truck_size');
        this.loadCapacityErrorStatus = true;

        return false;
      }
      if ((capacity < 18 || capacity > 33) && capacity <= size) {
        this.validationErrorMessage = this.$t('truckValidationMxn.loading_capacity_less_than_or_more_than_33tones');
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
        this.truckValidationErrorMessage =  this.$t('truckValidationMxn.input_truck_size');
        this.truckSizeErrorStatus = true;
        return false;
      }
      if (size < 18 || size > 33) {
        this.truckValidationErrorMessage =  this.$t('truckValidationMxn.truck_size_less_or_more');
        this.truckSizeErrorStatus = true;
        return false;
      }
      this.truckSizeErrorStatus = false;
      this.truckValidationErrorMessage = '';
      return true;
    },

    tonnageValidity() {
      if (parseInt(this.vendorType, 10) === 25) {
        return this.validateLoadCapacity() && this.validateTruckSize();
      }
      return true;
    },
  },
};

export default truckValidationMixin;
