<template lang="html">
  <documentsLoading v-if="show_loading" />
  <div class="stats-dash" v-else>
    <div class="row dashboard__row">
      <el-table :data="tableData" class="documents-table-outer">
        <el-table-column label="" width="50">
          <i class="el-icon-success success-license"></i>
        </el-table-column>
        <el-table-column width="400">
          <template slot-scope="scope">
            <div class="performance--outer-overlay">
              <div class="partner--image">
                <img class="partner-icon" :src="`https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/${tableData[scope.$index]['photo']}`" alt="" />
              </div>
              <div class="rider--info driver-info">
                <p class="rider--name">{{ tableData[scope.$index]['name'] }}</p>
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
    <el-dialog title="Update Driving License" :visible.sync="dialogVisible" width="27%" :before-close="handleClose">
      <div class="inner-dialog">
        <div class="drag-image">
          <div class="download-refund-img">
            <el-upload class="upload-demo" drag action="handlePictureCardPreview" :http-request="handlePictureCardPreview" :on-remove="handleRemove">
              <i class="el-icon-upload"></i>
              <div v-if="Object.keys(licenseImageData).length > 0">Change</div>
              <div v-else>Drop file here or <em>click to upload</em></div>
            </el-upload>
            <div v-if="Object.keys(licenseImageData).length > 0">
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
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import documentsLoading from './documentsLoading.vue';

export default {
  name: 'drivingLicense',
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
      license_data: {},
      licenseImageData: {},
      dialogVisible: false,
      tableData: [
        {
          photo: 'IMG_2458.JPG',
          name: 'Tom',
          status: 'Driving license expires on Dec 5, 2020',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          photo: 'IMG_2603.JPG',
          name: 'James',
          status: 'Driving license expires on Dec 5, 2020',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          photo: 'IMG_20150904_135016.jpg',
          name: 'Kelvin',
          status: 'Driving license expires on Dec 5, 2020',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.getLicenseData();
    }, 5000);
  },
  methods: {
    getLicenseData() {
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
      this.licenseImageData = file;
      console.log('file', file);
    },
    handleRemove(file, fileList) {
      this.licenseImageData = {};
    },
  },
};
</script>

<style scoped>
@import '../assets/css/performance_section.css?v=1';
.driver-info {
  padding-top: 9%;
}
</style>
