### Signal Denoising with Deep Learning

This project explores various signal denoising techniques, including traditional adaptive filters (LMS) and deep learning models (1D Convolutional Neural Network and Denoising Autoencoder). It involves generating diverse synthetic datasets, training and evaluating models, hyperparameter tuning, and exploring model compression techniques like quantization and pruning.

#### 1. Code Structure
The overall organization and flow of the notebook is as follows: data generation -> CNN training -> CNN evaluation -> CNN tuning -> DAE training -> DAE evaluation -> comprehensive comparisons.

The notebook is organized into the following sections:

-   **1D CNN Model (Initial Training & Evaluation):**
    -   Basic signal generation (sine wave, AWGN).
    -   Definition of `calculate_snr` function.
    -   LMS filter application.
    -   1D CNN model definition (`DenoiseCNN`).
    -   Initial CNN training on a single sine wave dataset.
    -   Evaluation and plotting of initial CNN performance against LMS.
-   **Generating Diverse Dataset:**
    -   Helper functions for generating diverse clean signals (sine, multi-tone, chirp, speech-like) and various noise types (AWGN, colored, impulse).
    -   Generation of a comprehensive training dataset (`X_train_tensor`, `y_train_tensor`) covering different signal and noise characteristics.
-   **Retraining CNN with Diverse Dataset:**
    -   Setup of `TensorDataset` and `DataLoader`.
    -   Retraining of the `DenoiseCNN` model on the diverse dataset.
-   **Generating Diverse Test Data:**
    -   Generation of a separate, diverse test dataset (`X_test_tensor`, `y_test_tensor`, `signal_types_test_np`).
-   **Evaluating Retrained CNN on Diverse Test Data:**
    -   Evaluation of the retrained CNN's performance on the diverse test set using SNR improvement.
    -   Visualization of denoising performance for selected test samples.
-   **Hyperparameter Tuning for CNN:**
    -   Generation of a validation dataset.
    -   Hyperparameter search for the `DenoiseCNN` model using validation performance.
-   **RMSE for LMS vs CNN Across the Test Set:**
    -   Definition of `calculate_rmse` function.
    -   Comparison of LMS and CNN performance using RMSE on the test set.
    -   Visualization of RMSE distributions.
-   **Quantization/Pruning for CNN:**
    -   Helper function to calculate model size.
    -   `QuantizedDenoiseCNN` wrapper definition.
    -   Application of post-training static quantization (INT8) to the CNN model.
    -   Evaluation of the quantized CNN.
    -   Application of global unstructured pruning to the CNN model.
    -   Evaluation of the pruned CNN.
-   **Denoising Autoencoder (DAE):**
    -   Definition of the `DenoiseDAE` model architecture.
-   **Train DenoiseDAE with Diverse Dataset and Evaluate:**
    -   Training loop for the `DenoiseDAE` model on the diverse dataset.
    -   Evaluation of `DenoiseDAE` on the validation set.
-   **Hyperparameter Tuning for DenoiseDAE:**
    -   Hyperparameter search for the `DenoiseDAE` model using validation performance.
-   **Evaluate DenoiseDAE on Test Data:**
    -   Evaluation of the tuned `DenoiseDAE` on the diverse test set.
-   **RMSE for LMS vs DenoiseDAE Across the Test Set:**
    -   Comparison of LMS and DenoiseDAE performance using RMSE on the test set, including outlier handling for LMS.
    -   Visualization of RMSE distributions.
-   **Analysis by Signal Type:**
    -   Detailed analysis of LMS and DenoiseDAE performance (RMSE and SNR improvement) categorized by signal and noise type.
    -   Bar charts for visualizing performance across different signal types.
-   **Overall Average SNR Improvement Comparison:**
    -   Summary bar chart comparing the overall average SNR improvement of LMS, 1D CNN, and DenoiseDAE.
-   **Average SNR Improvement Comparison Across Signal Types (LMS vs. 1D CNN vs. DenoiseDAE):**
    -   Detailed bar chart comparing average SNR improvement for all three methods across signal types.
-   **Average RMSE Comparison Across Signal Types (LMS vs. 1D CNN vs. DenoiseDAE):**
    -   Detailed bar chart comparing average RMSE for all three methods across signal types.
-   **Performance Metrics by Signal/Noise Type Table:** A markdown table summarizing performance.

#### 2. Dependencies

The project relies on the following Python libraries:

-   `padasip`: For Least Mean Squares (LMS) adaptive filtering.
-   `numpy`: For numerical operations and array manipulation.
-   `matplotlib`: For plotting and visualization.
-   `torch` and `torch.nn`: For building and training deep learning models (CNN, DAE).
-   `scipy.signal.chirp`: For generating chirp signals.
-   `torch.quantization`: For model quantization.
-   `torch.nn.utils.prune`: For model pruning.

To install these dependencies, run the `pip install padasip` cell at the beginning of the notebook. Other libraries are typically pre-installed in Google Colab environments.

#### 3. Instructions to Run the Project

1.  **Open the Notebook:** Upload or open the `.ipynb` file in Google Colab.
2.  **Run All Cells:** Execute all cells in the notebook sequentially from top to bottom. This can be done by navigating to `Runtime -> Run all` in the Colab menu.
3.  **Review Outputs:** Observe the printed outputs, plots, and evaluation metrics generated throughout the notebook.

#### 4. Code Attribution

The codebase for this project is built upon a foundational structure with several key components adapted from prior work, and specific additions and modifications made during the project development.

**Adapted from Prior Code:**

*Note: There are no specific line numbers in this notebook that I am able to point out, but the functions are adapated to fit the objectives of this project.*

The helper functions for signal generation (`generate_sine`, `generate_multi_tone`, `generate_chirp`, `generate_speech_like_signal`) and noise addition (`add_awgn`, `add_colored_noise`, `add_impulse_noise`), are adapted from a pre-existing project codebase. Similarly, the initial `DenoiseCNN` and `DenoiseDAE` model architectures and their respective training and evaluation paradigms (including the initial single-signal CNN training, diverse dataset training, and test set evaluations) are derived from the same prior work. The quantization and pruning sections also follow an adapted structure.
