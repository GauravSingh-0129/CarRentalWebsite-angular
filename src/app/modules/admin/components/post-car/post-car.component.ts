import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { every } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-car',
  templateUrl: './post-car.component.html',
  styleUrls: ['./post-car.component.scss']
})
export class PostCarComponent {

  postCarForm : FormGroup | any;
  isSpinning: boolean = false;
  selectedFile: File | any | null;
  imagePreview: string | ArrayBuffer | null | undefined;

  listOfOption: Array<{label: string; value:string}> = [];
  listOfBrands = ["Audi", "BMW", "Ferrari", "Ford", "Honda", "Hyundai", "KIA", "Lexus", "Nissan", "Tesla", "Toyota", "Volvo"];
  listOfTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  listOfTransmission = ["Automatic", "Manual"];
  listOfColor = ["Black", "Blue", "Grey", "Orange", "Red", "Silver", "White"];

  constructor(private fb: FormBuilder, private adminService: AdminService,
              private message: NzMessageService, private router: Router){}

  ngOnInit(){
    this.postCarForm = this.fb.group({
      name : [null, Validators.required],
      brand : [null, Validators.required],
      type : [null, Validators.required],
      color : [null, Validators.required],
      transmission : [null, Validators.required],
      price : [null, Validators.required],
      description : [null, Validators.required],
      year : [null, Validators.required]
    })
  }

  postCar(){
    console.log(this.postCarForm.value);
    this.isSpinning = true;
    const formData: FormData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('brand', this.postCarForm.get('brand').value);
    formData.append('name', this.postCarForm.get('name').value);
    formData.append('type', this.postCarForm.get('type').value);
    formData.append('color', this.postCarForm.get('color').value);
    formData.append('year', this.postCarForm.get('year').value);
    formData.append('transmission', this.postCarForm.get('transmission').value);
    formData.append('description', this.postCarForm.get('description').value);
    formData.append('price', this.postCarForm.get('price').value);
    console.log(formData);
    this.adminService.postCar(formData).subscribe((res) => {
      this.isSpinning = false;
      this.message.success("Car is posted successfully...!", {nzDuration: 5000});
      this.router.navigateByUrl("/admin/dashboard");
      console.log(res);
    }, error => {
    this.message.error("Something went wrong. Please try again...!", {nzDuration: 5000})
  });
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
    this.previewImage();
    // this.postCarForm.patchValue({
    //   [field]:this.selectedFile
    // }
    // )
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }
}
