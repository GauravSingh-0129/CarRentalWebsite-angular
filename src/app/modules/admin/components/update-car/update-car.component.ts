import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.scss']
})
export class UpdateCarComponent {

  carId: number = this.activatedRoute.snapshot.params["id"];
  existingImage: string | null = null;
  updateForm: FormGroup | any;
  isSpinning: boolean = false;

  listOfOption: Array<{label: string; value:string}> = [];
  listOfBrands = ["Audi", "BMW", "Ferrari", "Ford", "Honda", "Hyundai", "KIA", "Lexus", "Nissan", "Tesla", "Toyota", "Volvo"];
  listOfTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  listOfTransmission = ["Automatic", "Manual"];
  listOfColor = ["Black", "Blue", "Grey", "Orange", "Red", "Silver", "White"];

  imgChanged: boolean = false;
  selectedFile: any;
  imagePreview: string | ArrayBuffer | null | undefined;
  

  constructor(private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder, private message: NzMessageService,
    private router: Router){}

  ngOnInit(){
    this.updateForm = this.fb.group({
      name : [null, Validators.required],
      brand : [null, Validators.required],
      type : [null, Validators.required],
      color : [null, Validators.required],
      transmission : [null, Validators.required],
      price : [null, Validators.required],
      description : [null, Validators.required],
      year : [null, Validators.required]
    })
    this.getCarById();
  }

  getCarById(){
    this.isSpinning = true;
    this.adminService.getCarById(this.carId).subscribe((res) => {
      // console.log(res);
      this.isSpinning = false;
      const carDto = res;
      carDto.year = new Date(carDto.year);
      this.existingImage = 'data:image/jpeg;base64,' + res.returnedImage;
      console.log(carDto);
      console.log("fetchingggg",carDto.year, typeof(carDto.year))
      console.log(this.existingImage);
      this.updateForm.patchValue(carDto);
    })
  }

  updateCar(){
    console.log(this.updateForm.value);
    this.isSpinning = true;
    const formData: FormData = new FormData();
    if(this.imgChanged && this.selectedFile){
      formData.append('image', this.selectedFile);
    }
    formData.append('brand', this.updateForm.get('brand').value);
    formData.append('name', this.updateForm.get('name').value);
    formData.append('type', this.updateForm.get('type').value);
    console.log(typeof(this.updateForm.get('year').value));
    formData.append('color', this.updateForm.get('color').value);
    formData.append('year', this.updateForm.get('year').value);
    formData.append('transmission', this.updateForm.get('transmission').value);
    formData.append('description', this.updateForm.get('description').value);
    formData.append('price', this.updateForm.get('price').value);
    console.log(formData);
    this.adminService.updateCar(this.carId, formData).subscribe((res) => {
      this.isSpinning = false;
      this.message.success("Car updated successfully...!", {nzDuration: 5000});
      this.router.navigateByUrl("/admin/dashboard");
      console.log(res);
    }, error => {
    this.message.error("Error while updating Car...", {nzDuration: 5000})
    console.log(error)
  });
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
    this.imgChanged = true;
    this.existingImage = null;
    this.previewImage();
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }
}
