import { useState, useCallback } from 'react';
import { uploadFile } from '../services/api';
import styles from './ImageUpload.module.css';

function ImageUpload({ value, onChange, disabled }) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    const validateAndUpload = async (file) => {
        setError('');
        if (!file) return;

        // Front-end validations
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Unsupported file type. Please upload JPEG, PNG, WebP, or GIF.');
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2 MB
        if (file.size > maxSize) {
            setError('File size too large. Maximum size allowed is 2 MB.');
            return;
        }

        // Uploading
        setUploading(true);
        setProgress(0);
        try {
            const data = await uploadFile(file, (percent) => {
                setProgress(percent);
            });
            if (data && data.url) {
                onChange(data.url);
            } else {
                setError('Failed to retrieve upload URL. Try again.');
            }
        } catch (err) {
            console.error('Upload error details:', err);
            const errMsg = err.response?.data?.message || 'Network error encountered during upload.';
            setError(errMsg);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (disabled || uploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndUpload(e.dataTransfer.files[0]);
        }
    }, [disabled, uploading]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndUpload(e.target.files[0]);
        }
    };

    const handleRemove = (e) => {
        e.preventDefault();
        onChange('');
        setError('');
    };

    return (
        <div className={styles.uploadContainer}>
            {error && <div className={styles.error} role="alert">{error}</div>}

            {value ? (
                <div className={styles.previewContainer}>
                    <img src={value} alt="Uploaded preview" className={styles.previewImage} />
                    <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={handleRemove}
                        disabled={disabled || uploading}
                    >
                        Remove Image
                    </button>
                </div>
            ) : (
                <div
                    className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''} ${uploading ? styles.uploadingZone : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="coffee-image-file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className={styles.hiddenInput}
                        onChange={handleFileChange}
                        disabled={disabled || uploading}
                    />

                    {uploading ? (
                        <div className={styles.progressWrapper}>
                            <div className={styles.spinner}></div>
                            <span className={styles.progressText}>Uploading Coffee Image ({progress}%)</span>
                            <div className={styles.progressBarBg}>
                                <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    ) : (
                        <label htmlFor="coffee-image-file" className={styles.labelWrapper}>
                            <span className={styles.icon}>📷</span>
                            <span className={styles.instruction}>
                                <strong>Drag & drop</strong> your coffee image, or <span>browse</span>
                            </span>
                            <span className={styles.subtext}>JPEG, PNG, WebP or GIF up to 2 MB</span>
                        </label>
                    )}
                </div>
            )}
        </div>
    );
}

export default ImageUpload;
