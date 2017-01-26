package com.agorask.radialAnimatedView;

import android.animation.Animator;
import android.content.Context;
import android.view.View;
import android.view.ViewAnimationUtils;
import android.view.ViewGroup;
import android.util.Log;

import static android.R.attr.radius;

/**
 * Created by nolitsou on 1/25/17.
 */

public class RadialAnimatedView extends ViewGroup {
    private boolean revealed = false;
    private Animator anim;

    private int cx = -1;
    private int cy = -1;


    public RadialAnimatedView(Context context) {
        super(context);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        if (this.revealed) {
            setVisibility(View.VISIBLE);
        } else {
            setVisibility(View.INVISIBLE);
        }
    }


    private void cancel() {
        if (this.anim != null) {
        Log.i("RadialAnimatedView", "Canceling previous animation");
            this.anim.cancel();
        }
    }
    private void reveal(int x, int y) {
        Log.i("RadialAnimatedView", "Start revealing with center (" + x + ", " + y + ")");
        this.cancel();

        float finalRadius = (float) Math.hypot(getWidth(), getHeight());
        this.anim = ViewAnimationUtils.createCircularReveal(this, x, y, 0, finalRadius);
        setVisibility(View.VISIBLE);
        anim.setDuration(500);
        anim.start();
    }

    private void reveal() {
        if (this.cx > -1 && this.cy > -1) {
            this.reveal(this.cx, this.cy);
            return;
        }
        Log.i("RadialAnimatedView", "Start revealing");
        this.cancel();

        int cx = getWidth() / 2;
        int cy = getHeight() / 2;

        float finalRadius = (float) Math.hypot(cx, cy);
        Log.i("RadialAnimatedView", "cx: " + cx + ", cy: " + cy + ", finalRadius: " + finalRadius);
        this.anim =
                ViewAnimationUtils.createCircularReveal(this, cx, cy, 0, finalRadius);

        setVisibility(View.VISIBLE);
        anim.start();
    }

    public void hide() {
        this.cancel();
        Log.i("RadialAnimatedView", "Start hidding");
        // get the center for the clipping circle
        int cx = getWidth() / 2;
        int cy = getHeight() / 2;
        if (this.cx > -1) {
            cx = this.cx;
        }
        if (this.cy > -1) {
            cy = this.cy;
        }

        // get the initial radius for the clipping circle
        float initialRadius = (float) Math.hypot(cx, cy);

        Log.i("RadialAnimatedView", "cx: " + cx + ", cy: " + cy + ", initialRadius: " + initialRadius);
        // create the animation (the final radius is zero)
        this.anim =
                ViewAnimationUtils.createCircularReveal(this, cx, cy, initialRadius, 0);

        // make the view invisible when the animation is done
        final View view = this;
        anim.addListener(new Animator.AnimatorListener() {
            @Override
            public void onAnimationStart(Animator animator) {}

            @Override
            public void onAnimationEnd(Animator animation) {
                view.setVisibility(View.INVISIBLE);
            }

            @Override
            public void onAnimationCancel(Animator animator) {}

            @Override
            public void onAnimationRepeat(Animator animator) {}
        });

        // start the animation
        anim.start();
    }

    public void setRevealed(boolean revealed) {
        if (this.revealed != revealed) {
            if (revealed) {
                this.reveal();
            } else {
                this.hide();
            }
            this.revealed = revealed;
        }
    }

    public void setCenter(int x, int y) {
        this.cx = x;
        this.cy = y;
    }

    

}
