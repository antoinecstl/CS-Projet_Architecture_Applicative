//--------------------------------------------
// Console Part
//--------------------------------------------

// Factorial function
function fact(n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}

console.log("Factorial of 6 is:", fact(6));

// Apply function
function applique(f, tab) {
    return tab.map(item => f(item));
}

// Test apply with factorial
console.log("Factorial of each element:", applique(fact, [1, 2, 3, 4, 5, 6]));

// Test apply with anonymous function
console.log("Increment each element:", applique(function(n) { return n + 1; }, [1, 2, 3, 4, 5, 6]));

//--------------------------------------------
// Client Logic Part
//--------------------------------------------

// Server URL
const SERVER_URL = 'https://cs-projet-architecture-applicative.onrender.com';

// Common emojis for the emoji picker
const commonEmojis = ["👍", "👎", "😊", "😂", "❤️", "🎉", "👏", "🤔", "😍", "🙏"];

// Function to format date in a more readable way
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Relative time for recent messages
    if (diffMins < 60) {
        return diffMins <= 0 ? 'just now' : diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`;
    }
    
    // Older messages, show a more readable date format
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString(undefined, options);
}

// Loading state
function setLoading(elementId, isLoading) {
    const element = document.getElementById(elementId);
    if (isLoading) {
        element.classList.add("loading");
    } else {
        element.classList.remove("loading");
    }
}

// Update the messages list
function update(messages) {
    const messagesList = document.getElementById("messages-list");
    
    messagesList.innerHTML = "";
    
    // Add new messages with animation delay
    messages.forEach((message, index) => {
        const li = document.createElement("li");
        li.style.animationDelay = `${index * 0.05}s`;
        
        const messageContent = document.createElement("div");
        messageContent.className = "message-content";
        
        // Handle both string and object messages
        if (typeof message === 'string') {
            messageContent.textContent = message;
        } else {
            messageContent.textContent = message.msg;
            
            // Message metadata (pseudo and date)
            const messageMeta = document.createElement("div");
            messageMeta.className = "message-meta";
            
            const formattedDate = formatDate(message.date);
            
            // Pseudo = Anonymous if empty
            messageMeta.textContent = `Posted by ${message.pseudo || "Anonymous"} • ${formattedDate}`;
            messageContent.appendChild(messageMeta);
        }
        
        li.appendChild(messageContent);
        
        // Delete button for each message
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function() {

            if (confirm("Are you sure you want to delete this message?")) {
                deleteMessage(index);
                li.style.opacity = "0.5";
                li.style.transform = "translateX(10px)";
                li.style.transition = "all 0.3s ease";
            }
        });
        li.appendChild(deleteButton);
        
        messagesList.appendChild(li);
    });
    
    // Scroll to the bottom of the messages container
    const messagesContainer = messagesList.parentElement;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fetch all messages from the server
function fetchMessages() {
    setLoading("messages-section", true);
    
    fetch(`${SERVER_URL}/msg/getAll`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Messages retrieved:", data);
            update(data);
            setLoading("messages-section", false);
        })
        .catch(function(error) {
            console.error("Error fetching messages:", error);
            setLoading("messages-section", false);
            alert("Failed to load messages. Please try again.");
        });
}

// Add a new message
function addMessage() {
    const messageInput = document.getElementById("message-input");
    const pseudoInput = document.getElementById("pseudo");
    
    if (messageInput.value.trim() !== "") {
        const messageText = messageInput.value.trim();
        const pseudo = pseudoInput.value.trim() || "Anonymous";
        
        // Disable the send button to prevent multiple submissions
        const sendButton = document.getElementById("send-button");
        sendButton.disabled = true;
        sendButton.textContent = "Sending...";
        
        // Post message to server with pseudo as query parameter
        fetch(`${SERVER_URL}/msg/post/${encodeURIComponent(messageText)}?pseudo=${encodeURIComponent(pseudo)}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log("Message posted, index:", data);
                
                // Success animation
                const postSection = document.getElementById("post-section");
                postSection.style.animation = "pulse 0.5s";
                setTimeout(() => {
                    postSection.style.animation = "";
                }, 500);
                
                // Refresh messages from server
                fetchMessages();
                
                // Scroll to bottom after adding new message
                const messagesList = document.getElementById("messages-list");
                const messagesContainer = messagesList.parentElement;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                messageInput.value = "";
                
                // Re-enable the send button
                sendButton.disabled = false;
                sendButton.textContent = "Envoyer";
            })
            .catch(function(error) {
                console.error("Error posting message:", error);
                alert("Failed to post message. Please try again.");
                
                // Re-enable the send button
                sendButton.disabled = false;
                sendButton.textContent = "Envoyer";
            });
    }
}

// Delete a message
function deleteMessage(index) {
    fetch(`${SERVER_URL}/msg/del/${index}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Message deletion result:", data);
            fetchMessages();
        })
        .catch(function(error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message. Please try again.");
        });
}

// Toggle between light and dark themes
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    
    // Save theme preference in localStorage so it's persistent
    const isDarkTheme = document.body.classList.contains("dark-theme");
    localStorage.setItem('darkTheme', isDarkTheme);
    
    const themeButton = document.getElementById("toggle-style");
    themeButton.textContent = isDarkTheme ? "Passer en mode clair" : "Passer en mode sombre";
}

// Create and show emoji picker
function showEmojiPicker() {
    const existingPicker = document.querySelector(".emoji-picker");
    if (existingPicker) {
        existingPicker.remove();
        return;
    }
    
    const emojiPicker = document.createElement("div");
    emojiPicker.className = "emoji-picker";
    
    // Add emojis to the picker
    commonEmojis.forEach(emoji => {
        const emojiItem = document.createElement("span");
        emojiItem.className = "emoji-item";
        emojiItem.textContent = emoji;
        emojiItem.addEventListener("click", function() {
            insertEmoji(emoji);
        });
        emojiPicker.appendChild(emojiItem);
    });
    
    const emojiButton = document.getElementById("emoji-button");
    const buttonRect = emojiButton.getBoundingClientRect();
    
    // Create a container for proper positioning
    const pickerContainer = document.createElement("div");
    pickerContainer.style.position = "absolute";
    pickerContainer.style.zIndex = "1000";
    pickerContainer.style.top = `${buttonRect.top + window.scrollY}px`;
    pickerContainer.style.left = `${buttonRect.right + window.scrollX + 5}px`;
    
    pickerContainer.appendChild(emojiPicker);
    document.body.appendChild(pickerContainer);
    
    // Show the picker with animation
    setTimeout(() => {
        emojiPicker.classList.add("visible");
    }, 10);
    
    // Close the picker when clicking outside
    document.addEventListener("click", function closeEmojiPicker(e) {
        if (!emojiPicker.contains(e.target) && e.target !== emojiButton) {
            pickerContainer.remove();
            document.removeEventListener("click", closeEmojiPicker);
        }
    });
}

// Function to insert emoji into message input
function insertEmoji(emoji) {
    const messageInput = document.getElementById("message-input");
    messageInput.value += emoji;
    messageInput.focus();
}

// Initialize page when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    
    // Fetch messages from server when page loads
    fetchMessages();
    
    // Event listener for send button
    document.getElementById("send-button").addEventListener("click", addMessage);
    
    // Event listener for update button
    document.getElementById("update-button").addEventListener("click", function() {
        fetchMessages();
    });
    
    // Event listener for style toggle button
    document.getElementById("toggle-style").addEventListener("click", toggleTheme);
    
    // Event listener for Enter key in the message input
    document.getElementById("message-input").addEventListener("keydown", function(event) {
        // Check if enter was pressed without Shift key
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // (newline)
            addMessage();
        }
    });
    
    // Event listener for emoji button
    const emojiButton = document.getElementById("emoji-button");
    if (emojiButton) {
        emojiButton.addEventListener("click", showEmojiPicker);
    }
    
    // Automatic refresh every 1/2 minute
    setInterval(fetchMessages, 30000);
    
    // Load theme preference from localStorage
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    }
});
