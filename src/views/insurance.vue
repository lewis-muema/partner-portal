<template lang="html">
  <documentsLoading v-if="show_loading" />
  <div class="stats-dash" v-else>
    <div class="row dashboard__row">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="" width="50">
          <i class="el-icon-success success-license"></i>
        </el-table-column>
        <el-table-column width="400">
          <template slot-scope="scope">
            <div class="performance--outer-overlay">
              <div class="rider--info insurance-rider-data">
                <p class="rider--name">{{ tableData[scope.$index]['vendor'] }} {{ tableData[scope.$index]['vehiclePlate'] }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="700"> </el-table-column>
        <el-table-column>
          <el-button size="mini" class="update-license" @click="openUpdateDialog()">
            Update
          </el-button>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="Update Vehicle Insurance" :visible.sync="dialogVisible" width="27%" :before-close="handleClose">
      <div class="inner-dialog">
        <div class="drag-image">
          <div class="download-refund-img">
            <el-upload class="upload-demo" drag action="handlePictureCardPreview" :http-request="handlePictureCardPreview" :on-remove="handleRemove">
              <i class="el-icon-upload"></i>
              <div v-if="Object.keys(insuranceImageData).length > 0">Change</div>
              <div v-else>Drop file here or <em>click to upload</em></div>
            </el-upload>
            <div v-if="Object.keys(insuranceImageData).length > 0">
              <span class="reward-upload-label">
                Document uploaded successfully .
              </span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()" class="cancel-refund">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false" class="confirm-refund">Update</el-button>
      </span>
    </el-dialog>
  </div></template>

<script>
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';

export default {
  name: 'insurance',
  components: { documentsLoading },
  data() {
    return {
      show_loading: true,
      colors: '#F57E20',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      insuranceData: {},
      insuranceImageData: {},
      dialogVisible: false,
      tableData: [
        {
          vendor: 'Van',
          vehiclePlate: 'KBS 127V',
          status: 'Insurance expires on Dec 5, 2020',
        },
        {
          vendor: 'Bike',
          vehiclePlate: 'KBS 127V',
          status: 'Insurance expires on Dec 5, 2020',
        },
        {
          vendor: 'PickUp',
          vehiclePlate: 'KBS 127V',
          status: 'Insurance expires on Dec 5, 2020',
        },
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.getInsuranceData();
    }, 5000);
  },
  methods: {
    getInsuranceData() {
      this.show_loading = false;
    },
    openUpdateDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm('Are you sure to close this dialog?')
        .then(_ => {
          done();
          this.closeDialog();
        })
        .catch(_ => {});
    },
    handlePictureCardPreview(file) {
      this.insuranceImageData = file;
      console.log('file', file);
    },
    handleRemove(file, fileList) {
      this.insuranceImageData = {};
    },
  },
};
</script>

<style>
@import '../assets/css/performance_section.css';
.insurance-rider-data {
  padding-top: 3%;
}
</style>
