import { Component, OnInit ,ViewChild,Inject} from '@angular/core';
import {Dish} from '../shared/dish';
import {Comment} from '../shared/comment';
import {Params} from '@angular/router';
import{Location} from '@angular/common';
import {DishService} from '../service/dish.service';
import { ActivatedRoute } from '@angular/router';
import {switchMap} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {trigger, state, style, animate, transition} from '@angular/animations';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations:[
    trigger('visibility',[
      state('shown',style({
        transform:'scale(1.0)', opacity:1
      })),
      state('hidden',style({
        transform:'scale(0.5)',opacity:0
      })),
      transition('* => *',animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {
 
  
  commentForm: FormGroup;
  comment: Comment;
  errMsg:string;
  date:any;
    dish :Dish;
    dishIds:string[];
    flag:boolean;
    prev:string;
    next:string;
    dishCopy:Dish;
    @ViewChild('cform') commentFormDirective;
    visibility='shown';
    formErrors={
      'author':'',
      'comment':'',
    };

    validationMessages = {
      'author': {
        'required':      'Name is required.',
        'minlength':     'Name must be at least 2 characters long.',
        'maxlength':     'Name cannot be more than 25 characters long.'
      },
      'comment': {
        'required':      'Comment is required.',
        'minlength':     'Comment must be at least 2 characters long.',
        'maxlength':     'Comment cannot be more than 25 characters long.'
      }
    };
  
  constructor(@Inject('BaseURL') private BaseURL,private fb:FormBuilder, private dishService:DishService, private route:ActivatedRoute,private location: Location) { this.createForm(); }
  createForm()
  {
      this.commentForm=this.fb.group(
        {
          author:['',[Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
          rating:5,
          comment:['',[Validators.required, Validators.minLength(2),Validators.maxLength(25)]]
        }
      );

      this.commentForm.valueChanges
    .subscribe(data=>this.onValueChanged(data));

    this.onValueChanged();
  
  }

  onValueChanged(data?:any)
  {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }



  onSubmit()
  {
    this.comment=new Comment();
    this.date=Date.now();
    this.flag=true;
    this.comment.author=this.commentForm.get("author").value;
    this.comment.rating=this.commentForm.get("rating").value;
    this.comment.comment=this.commentForm.get("comment").value;
    this.comment.date=this.date;
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy)
    .subscribe(dish=>{
      this.dish=dish;
      this.dishCopy=dish;
    },errmsg=>
    {
      this.dish=null;
      this.dishCopy=null;
      this.errMsg=<any>errmsg;
    });
    console.log(this.comment);
    this.commentForm.reset({
      author:'',
      rating:5,
      comment:'',
    });
  }
  ngOnInit() {
    this.dishService.getDishIds().subscribe((dishIds)=>this.dishIds=dishIds,errmsg=>this.errMsg=<any>errmsg);
    this.route.params
    .pipe(switchMap(
      (params:Params)=>{this.visibility='hidden'; return this.dishService.getDish(params['id'])}
      ))
    .subscribe(dish=>{
      this.visibility='shown';
      this.dish=dish;
      this.dishCopy=dish;
      this.setPrevNext(dish.id);
    },error=>this.errMsg=<any>error);
  }

  setPrevNext(dishId:string)
  {
    const index=this.dishIds.indexOf(dishId);
    this.prev=this.dishIds[(this.dishIds.length +index-1)%this.dishIds.length];
    this.next=this.dishIds[(this.dishIds.length +index+1)%this.dishIds.length];


  }

  goBack():void
  {
    this.location.back();
  }

}
