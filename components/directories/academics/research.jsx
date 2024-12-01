import React from "react";
import Link from "next/link";

export default function Research() {
  return (
    <div className="pt-6">
      <h3 className="text-md font-medium">
        The Influence of Neuromarketing: Machine Learning Based Empirical
        Analysis
      </h3>
      <p className="text-xs">
        {">"} Investigated neuromarketing{"'"}s application in market research,
        employing advanced machine learning methods such as LSTM, Logistic
        Regression and Neural Networks for EEG signal analysis. <br />
        {">"} Explored consumer responses to marketing stimuli using
        neuroimaging techniques like fMRI, EEG and eye tracking, bridging the
        gap between stated preferences and actual choices.
      </p>

      <h3 className="text-md font-medium pt-4">
        Image Processing and Classification: Comparative Analysis Using Machine
        Learning Models
      </h3>
      <p className="text-xs">
        {">"} Executed a detailed comparison of Logistic Regression, Neural
        Networks, Custom CNN, ResNet-50 and Inception Net on a 2,400-image
        dataset, achieving an 80.5% F1 score with Neural Networks and advancing
        accuracy with CNN architectures. <br />
        {">"} Addressed complex image classification challenges across 5
        categories (Compass, Lifeboat, Limousine, Moving-Van, Pay-phone),
        employing 3x3 kernel CNNs and residual learning techniques to overcome
        underfitting in deep learning models.
      </p>

      <p className="pt-2 text-xs">
        <span>Github: </span>
        <Link
          href={"https://github.com/AAMuktadir/image-processing"}
          className="text-blue-700"
          target="_blank"
        >
          https://github.com/AAMuktadir/image-processing
        </Link>
      </p>
    </div>
  );
}
