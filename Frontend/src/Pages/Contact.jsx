// import React, { useState } from 'react';
// import { getCurrentUser } from "../utils/auth";
// import { saveInquiry } from "../utils/api";
// import './Contact.css';

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     message: ''
//   });

//   // Name Validation: Khali Letters (A-Z, a-z) ane space j allow karse
//   const handleNameChange = (e) => {
//     const value = e.target.value;
//     if (/^[a-zA-Z\s]*$/.test(value)) {
//       setFormData({ ...formData, name: value });
//     }
//   };

//   // Phone Validation: Khali Numbers (0-9) j allow karse
//   const handlePhoneChange = (e) => {
//     const value = e.target.value;
//     if (/^[0-9]*$/.test(value)) {
//       setFormData({ ...formData, phone: value });
//     }
//   };

//   // Bija fields mate normal change handler
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const currentUser = getCurrentUser();

//     const inquiry = {
//       userId: currentUser ? currentUser.id : null,
//       name: formData.name,
//       phone: formData.phone,
//       email: formData.email,
//       message: formData.message,
//     };

//     try {
//       saveInquiry(inquiry);
//       alert("Tamari details successfully submit thai gai chhe!");
//       setFormData({ name: '', phone: '', email: '', message: '' });
//     } catch (err) {
//       console.error(err);
//       alert('Unable to send message. Please try again.');
//     }
//   };

//   return (
//     <div className="contact-container">
//       <div className="contact-header">
//         <h2>Contact Us</h2>
//         <div className="underline mx-auto"></div>
//       </div>
      
//       <div className="contact-content">
//         <div className="contact-info">
//           <h3>Get in Touch</h3>
//           <p>📍 123, Main Road, Jamnagar, Gujarat - 361001</p>
//           <p>📞 +91 98765 43210</p>
//           <p>✉️ neelkanth@gmail.com</p>
//         </div>
        
//         <form className="contact-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Full Name</label>
//             <input 
//               type="text" 
//               name="name"
//               value={formData.name} 
//               onChange={handleNameChange} 
//               placeholder="Enter your name" 
//               required 
//             />
//           </div>

//           <div className="form-group">
//             <label>Phone Number</label>
//             <input 
//               type="text" 
//               name="phone"
//               value={formData.phone} 
//               onChange={handlePhoneChange} 
//               placeholder="Enter 10-digit number" 
//               maxLength="10" 
//               required 
//             />
//           </div>

//           <div className="form-group">
//             <label>Email Address</label>
//             <input 
//               type="email" 
//               name="email"
//               value={formData.email} 
//               onChange={handleChange} 
//               placeholder="Enter your email" 
//               required 
//             />
//           </div>

//           <div className="form-group">
//             <label>Message</label>
//             <textarea 
//               name="message"
//               value={formData.message} 
//               onChange={handleChange} 
//               placeholder="Write your message here..." 
//               rows="5"
//               required 
//             ></textarea>
//           </div>

//           <button type="submit" className="btn-submit">Send Message</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Contact;
import React, { useState } from 'react';
import { saveInquiry } from "../utils/api";
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Name Validation: Khali Letters (A-Z, a-z) ane space j allow karse
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setFormData({ ...formData, name: value });
    }
  };

  // Phone Validation: Khali Numbers (0-9) j allow karse
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setFormData({ ...formData, phone: value });
    }
  };

  // Bija fields mate normal change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inquiry = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
    };

    try {
      await saveInquiry(inquiry);
      alert("Tamari details successfully submit thai gai chhe!");
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Unable to send message. Please try again.');
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h2>Contact Us</h2>
        <div className="underline mx-auto"></div>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p>📍 123, Main Road, Jamnagar, Gujarat - 361001</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ neelkanth@gmail.com</p>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleNameChange} 
              placeholder="Enter your name" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone} 
              onChange={handlePhoneChange} 
              placeholder="Enter 10-digit number" 
              maxLength="10" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea 
              name="message"
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Write your message here..." 
              rows="5"
              required 
            ></textarea>
          </div>

          <button type="submit" className="btn-submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;