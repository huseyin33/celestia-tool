import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {BlockData, JsonResponse, LocationInfo, SpeedInfo} from "./head_interface";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  ipAddress: string = '';
  selectedMode: string = ''; // Add a variable to store the selected mode
  dropdownVisible: boolean = false; // Add a variable to control the visibility of the custom drop-down menu
  showNodeInfo = false;


  //left box variables
  currentHead: number = 0;
  yourHead: number = 0;
  synchronization = false;
  nodeWorkingStatus = false;
  balance: string = '';
  nodeType = this.selectedMode;
  uploadSpeed = '';
  downloadSpeed = '';
  city = ' ';
  organization = '';
  totalRam = 0;
  usedRam = 0;
  totalCpu = 0;
  celestiaCpuUsagePercentage = 0;
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  async onSubmit() {
    this.isLoading = true;
    await Promise.all([this.getSpeed(), this.getLocation(), this.getBalance(), this.cpuRamUsage(), this.cpuCelestiaPercent(),
      this.getHeadInfo(),
      this.exportAuthToken(),
      this.getSamplerStats(),]);


    this.showNodeInfo = true;
    this.isLoading = false;

  }

  async cpuCelestiaPercent() {
    try {
      const reponse = await this.http.get<{ cpuPercent: number }>(
        `http://${this.ipAddress}:8080/getCelestiaCpuUsage`
      ).toPromise();
      if (reponse != undefined) {
        this.celestiaCpuUsagePercentage = reponse.cpuPercent;
      }

    } catch (error) {
      console.error('An error occurred:', error);

    }
  }

  async cpuRamUsage() {
    try {
      const response = await this.http.get<{
        totalCPU: number,
        totalRam: number,
        usedRam: number
      }>(`http://${this.ipAddress}:8080/getRamCpuMemUsage`).toPromise();
      if (response != undefined) {
        console.log(response)
        this.totalRam = response.totalRam;
        this.totalCpu = response.totalCPU;
        this.usedRam = response.usedRam;
        console.log("tR,uR,tC", this.totalRam, this.usedRam, this.totalCpu)
      }

    } catch (error) {
      // Handle error if the request fails
      console.error('An error occurred:', error);
    }
  }

  async getSpeed(): Promise<void> {
    try {
      const response = await this.http.get<SpeedInfo>(`http://${this.ipAddress}:8080/speedInfo`).toPromise();
      if (response != undefined) {
        console.log(response)
        this.uploadSpeed = response.upload;
        this.downloadSpeed = response.download;
        console.log("up down", this.uploadSpeed, this.uploadSpeed)
      }

    } catch (error) {
      // Handle error if the request fails
      console.error('An error occurred:', error);
    }
  }

  async getLocation(): Promise<void> {
    try {
      const response = await this.http.get<LocationInfo>(`http://${this.ipAddress}:8080/location`).toPromise();
      if (response != undefined) {
        console.log("getLocation", response);

        this.city = response.City;
        this.organization = response.Organization;
        console.log("getLocation", response);
      }

    } catch (error) {
      console.log("error", error);
      alert("Make Sure required golang file is installed and running on your server with the same ip address")

    }
  }

  // Toggle the visibility of the custom drop-down menu
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Select a mode and hide the custom drop-down menu
  selectMode(mode: string) {
    this.selectedMode = mode;
    this.dropdownVisible = false;
  }


  async getBalance() {
    await this.http.get<{ denom: string; amount: string }>(`http://${this.ipAddress}:26659/balance`).subscribe(
      (response) => {
        console.log('Response:', response);
        console.log(this.selectedMode)
        this.balance = response.amount; // Store the amount in the variable
      },
      (error) => {
        console.error('Error:', error);

      }
    );
  }

  async getHeadInfo() {
    await this.http.get<BlockData>(`http://${this.ipAddress}:26659/head`).subscribe(
      (response) => {
        console.log("ResponseL", response.header.version)
      }, (error) => {
        console.log("Error:", error);
        alert("Make Sure your node is running and all required port is opened.")
      }
    );
  }

  async exportAuthToken() {
    await this.http.post<{ Token: string; }>(`http://${this.ipAddress}:8080/exportAuthToken`, {
      "NodeType": this.selectedMode,
    }).subscribe(
      (response) => {
        console.log("Response token", response.Token)
      }, error => {
        console.log("Error:", error);
      }
    )
  }

  async getSamplerStats() {
    await this.http.get<JsonResponse>(`http://${this.ipAddress}:8080/getSamplerStats`).subscribe(
      (response) => {
        console.log("getSamplerStats", response)
        this.currentHead = response.result.network_head_height;
        this.yourHead = response.result.head_of_sampled_chain;
        this.synchronization = response.result.catch_up_done;
        this.nodeWorkingStatus = response.result.is_running;
      }
    )
  }
}
