document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // 初始化语言设置
  initializeLanguage();

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch(`/activities?lang=${currentLanguage}`);
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Clear activity select options (except the default one)
      const defaultOption = activitySelect.querySelector('option[value=""]');
      activitySelect.innerHTML = '';
      activitySelect.appendChild(defaultOption);

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;
        
        // 获取本地化的活动信息
        const localizedActivity = t(`activities.${name}`);
        const displayName = localizedActivity && localizedActivity.name ? localizedActivity.name : name;

        activityCard.innerHTML = `
          <h4>${displayName}</h4>
          <p>${details.description}</p>
          <p><strong>${t('schedule')}:</strong> ${details.schedule}</p>
          <p><strong>${t('availability')}:</strong> ${spotsLeft} ${t('spotsLeft')}</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = displayName;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = `<p>${t('failedToLoad')}</p>`;
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}&lang=${currentLanguage}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message || t('signUpSuccess');
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        let errorMessage = result.detail || t('signUpFailed');
        
        // 本地化错误消息
        if (result.detail === "Student already signed up") {
          errorMessage = t('studentAlreadySignedUp');
        } else if (result.detail === "Activity not found") {
          errorMessage = t('activityNotFound');
        }
        
        messageDiv.textContent = errorMessage;
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = t('signUpFailed');
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();

  // Make fetchActivities globally accessible for language switching
  window.fetchActivities = fetchActivities;
});
