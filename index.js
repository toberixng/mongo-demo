const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB..', err))

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255
        // match: /pattern/ 
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network']
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function(v){
                return v.length >= 0;
            },
            message: 'A course should have at least on tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; },
        min: 10,
        max: 200
    }   
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = new Course({
        name: 'Node.js Course',
        category: '-',
        author: 'Toberixng',
        tags: [],            
        isPublished: true,
        price: 15
    });

    try {
        const result = await course.save(); // this is used to save the document
        console.log(result)  
    }
    catch (ex) {
        console.log(ex.message);
    }
    
}

async function getCourses(){
    const pageNumber = 2;
    const pageSize = 10;

    const courses = await Course
        .find({ author: 'Toberixng', isPublished: true })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: 1})
        .select({ name: 1, tags: 1});
    console.log(courses);
}

// THIS METHOD IS QUERY FIRST
// async function updateCourse(id) {
//     const course = await Course.findById(id);
//     if (!course) return;
//     course.isPublished = true;
//     course.author = 'Eyitayo_rarity';
//     course.name = 'Angularjs Course';
//     course.tags = ['Angularjs', 'frontend'];

//     const result = await course.save();
//     console.log(result);
// }

// THIS METHOD IS UPDATE FIRST

async function updateCourse(id) {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            isPublished: false,
            author: 'Toberixng',
            name: 'React Course',

        }
    }, { new: true });
    console.log(course);
}

async function updateCourse(id) {
    const result = await Course.deleteOne( { _id: id});
    console.log(result)
}

createCourse();