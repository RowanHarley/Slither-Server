function Cell(FoodID, FoodType, mass){
    this.id = FoodID;
    this.type = FoodType; // 0 = Small sized, 1 = Medium sized, 2 = Mass
    if(this.type > 2 || this.type < 0){
        throw "[ERROR] Type of food must be between 0 and 2";
    }
    this.mass = mass;
}
