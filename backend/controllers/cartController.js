import userModel from "../models/userModel.js"

// add to user cart  
const addToCart = async (req, res) => {
   try {
      console.log('addToCart userId:', req.body.userId);
      console.log('addToCart itemId:', req.body.itemId);
      console.log('addToCart sideDishes:', req.body.sideDishes);
      
      let userData = await userModel.findOne({_id:req.body.userId});
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }
      let cartData = await userData.cartData;
      
      // Create cart key that includes side dishes if present
      let cartKey = req.body.itemId;
      if (req.body.sideDishes && req.body.sideDishes.length > 0) {
         const sideDishesString = JSON.stringify(req.body.sideDishes);
         const encodedSideDishes = Buffer.from(sideDishesString).toString('base64'); // Base64 encode
         cartKey = `${req.body.itemId}_${encodedSideDishes}`;
      }
      
      console.log('Generated cartKey:', cartKey);
      
      if (!cartData[cartKey]) {
         cartData[cartKey] = 1;
      }
      else {
         cartData[cartKey] += 1;
      }
      
      console.log('Updated cartData:', cartData);
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Added To Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// remove food from user cart
const removeFromCart = async (req, res) => {
   try {
      let userData = await userModel.findById(req.body.userId);
      let cartData = await userData.cartData;
      
      // Find the cart key that starts with the itemId
      let cartKey = req.body.itemId;
      for (const key in cartData) {
         if (key.startsWith(req.body.itemId)) {
            cartKey = key;
            break;
         }
      }
      
      if (cartData[cartKey] > 0) {
         cartData[cartKey] -= 1;
      }
      await userModel.findByIdAndUpdate(req.body.userId, {cartData});
      res.json({ success: true, message: "Removed From Cart" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }

}

// get user cart
const getCart = async (req, res) => {
   try {
      console.log('getCart userId:', req.body.userId);
      let userData = await userModel.findById(req.body.userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }
      let cartData = await userData.cartData;
      console.log('Retrieved cartData:', cartData);
      res.json({ success: true, cartData:cartData });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" })
   }
}

// clear user cart
const clearCart = async (req, res) => {
   try {
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
      res.json({ success: true, message: "Cart cleared" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error clearing cart" })
   }
}

export { addToCart, removeFromCart, getCart, clearCart }