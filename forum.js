const API_URL = 'https://73.189.237.188:8443/api/forum';
     const UPLOADS_URL = 'https://73.189.237.188:8443/Uploads';

     function loadForum() {
         fetch(API_URL)
           .then(response => response.json())
           .then(data => {
             if (data.success) {
               document.getElementById('forum').innerHTML = data.html;
               document.querySelectorAll('.message-image img').forEach(img => {
                   img.onerror = () => console.error('Image failed to load:', img.src);
                   console.log('Image URL:', img.src);
                 });
             } else {
               console.error('Failed to load forum:', data.error);
             }
           })
           .catch(error => console.error('Error fetching forum:', error));
     }

     function showReplyForm(parentId) {
       const formHtml = `
         <div class="reply-form">
           <input type="text" id="reply-name-${parentId}" placeholder="Your name"><br>
           <input type="email" id="reply-email-${parentId}" placeholder="Your email"><br>
           <textarea id="reply-message-${parentId}" placeholder="Your reply"></textarea><br>
           <input type="file" id="reply-image-${parentId}" accept="image/*"><br>
           <button onclick="submitReply('${parentId}')">Submit Reply</button>
           <button onclick="cancelReply('${parentId}')">Cancel</button>
         </div>
       `;
       const parentElement = document.getElementById(`message-${parentId}`);
       if (parentElement) {
         parentElement.insertAdjacentHTML('beforeend', formHtml);
       }
     }

     function cancelReply(parentId) {
       const replyForm = document.querySelector(`#message-${parentId} .reply-form`);
       if (replyForm) {
         replyForm.remove();
       }
     }

     function submitReply(parentId) {
         const name = document.getElementById(`reply-name-${parentId}`).value;
         const email = document.getElementById(`reply-email-${parentId}`).value;
         const message = document.getElementById(`reply-message-${parentId}`).value;
         const image = document.getElementById(`reply-image-${parentId}`).files[0];

         const formData = new FormData();
         formData.append('name', name);
         formData.append('email', email);
         formData.append('message', message);
         formData.append('parent_id', parentId);
         if (image) {
           formData.append('image', image);
         }

         fetch(API_URL, {
           method: 'POST',
           body: formData
         })
         .then(response => {
           console.log('POST /api/forum status:', response.status);
           return response.json()
         })
         .then(data => {
           console.log('Response:', data);
           if (data.success) {
             alert('Posted successfully!');
             loadForum();
             cancelReply(parentId);
           } else {
             alert('Error: ' + data.error);
           }
         })
         .catch(error => console.error('Error posting reply:', error));
     }

     function submitPost() {
         const name = document.getElementById('name').value;
         const email = document.getElementById('email').value;
         const message = document.getElementById('message').value;
         const image = document.getElementById('image').files[0];

         const formData = new FormData();
         formData.append('name', name);
         formData.append('email', email);
         formData.append('message', message);
         formData.append('parent_id', '0');
         if (image) {
           formData.append('image', image);
         }

         fetch(API_URL, {
           method: 'POST',
           body: formData
         })
         .then(response => {
           console.log('POST /api/forum status:', response.status);
           return response.json()
         })
         .then(data => {
           console.log('Response:', data);
           if (data.success) {
             alert('Posted successfully!');
             loadForum();
             document.getElementById('post-form').reset();
           } else {
             alert('Error: ' + data.error);
           }
         })
           .catch(error => console.error('Error posting message:', error));
         })
     }

     window.onload = loadForum;
