import cloudinary from "./../lib/cloudinary.js";
import Book from "./../models/Book.js";

export async function postBook(req, res) {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // upload the image to cloudinary

    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the database
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.log("Error creating book", error);
    res.status(500).json({ message: error.message });
  }
}

export async function getAllBook(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPage: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all books routes", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// get recommended books by the logged in user

export async function recommendedbooks(req, res) {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.error("Get user books error", error.message);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteBook(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // check if user is the creator of the book

    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // delete image from cloduniary as well
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Erro deleting image form cloudinary", error);
      }
    }

    await book.deleteOne();
    res.json({ message: "Book deleted  successfully" });
  } catch (error) {
    console.log("Error deleteing book", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
