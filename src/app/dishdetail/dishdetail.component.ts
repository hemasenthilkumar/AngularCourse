import { Component, OnInit} from '@angular/core';
import {Dish} from '../shared/dish';
import {Params} from '@angular/router';
import{Location} from '@angular/common';
import {DishService} from '../service/dish.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
 
    dish :Dish;
  constructor(private dishService:DishService, private route:ActivatedRoute,private location: Location) { }

  ngOnInit() {
    let id=this.route.snapshot.params['id'];
    this.dish=this.dishService.getDish(id);
  }

  goBack():void
  {
    this.location.back();
  }

}
